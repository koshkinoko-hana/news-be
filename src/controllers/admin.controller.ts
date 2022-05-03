import express from 'express'
const router = express.Router()

import createHttpError from 'http-errors'
import UpdateNewsRequest from '../dto/update-news.request'
import AdminService from '../services/admin.service'
import AuthService from '../services/auth.service'
import NewsService from '../services/news.service'

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.use(function checkAdmin(req, res, next) {
  const token = req.header('token')
  if(!AuthService.checkAuthorizedAdmin(token)){
    throw new createHttpError.Forbidden()
  }
  next()
})

router.get('/users', (req, res) => {
  res.status(200).json(AdminService.getUsers())
})

router.get('/user/:id/news', (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    throw new createHttpError.BadRequest('Required: id')
  }
  res.status(200).json(NewsService.getNewsByUser(id))
})

router.post('/user/:id', (req, res) => {
  const id = Number(req.params.id)
  const role = Number(req.query.role)
  if(!id || !role) {
    throw new createHttpError.BadRequest('Required: id, role')
  }
  AdminService.updateUserRole(id, role)
  res.sendStatus(200)
})

router.delete('/user/:id', (req, res) => {
  const id = Number(req.params.id)
  if(!id) {
    throw new createHttpError.BadRequest('Required: id')
  }
  AdminService.deleteUser(id)
  res.sendStatus(200)
})


router.put<{id: number}, any, any, UpdateNewsRequest>('/news/:id', (req, res) => {
  const id = Number(req.params.id)
  if(!id) {
    throw new createHttpError.BadRequest('Required: id')
  }
  const body = req.body
  AdminService.updateNews(id, body)
  res.sendStatus(200)
})

router.delete('/news/:id', (req, res) => {
  const id = Number(req.params.id)
  if(!id) {
    throw new createHttpError.BadRequest('Required: id')
  }
  AdminService.deleteNews(id)
  res.sendStatus(200)
})

router.post<any, any, any, string[]>('/news/tags', (req, res) => {

  const tags = req.body
  AdminService.updateTags(tags)
  res.sendStatus(200)
})

export default router
