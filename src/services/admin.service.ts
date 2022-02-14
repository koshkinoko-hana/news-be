import GetUsersAdminResponse from '../dto/get-users-admin.response'
import UpdateNewsRequest from '../dto/update-news.request'
import { AuthData } from '../entities/AuthData'
import { State } from '../entities/News'
import Storage from './storage'

export default class AdminService {
  public static getUsers() {
    const authorities = new Map<number, AuthData>();
    [...Storage.authorities.values()].forEach(auth => authorities.set(auth.userId, auth))
    const users = [...Storage.users.values()].map(user => (new GetUsersAdminResponse({
      ...user,
      ...authorities.get(user.id)
    })))
    return users
  }

  public static updateUserRole(id: number, role: number) {
    const user = [...Storage.authorities.values()].find(auth => auth.userId === id)
    user.role = role
  }

  public static deleteUser(id: number) {
    const [key, data] = [...Storage.authorities].find(([_,auth]) => auth.userId === id)
    Storage.authorized.delete(data.token)
    Storage.authorities.delete(key)
    Storage.users.delete(id)
  }

  public static updateNews(id: number, news: UpdateNewsRequest) {
    const oldNews = Storage.news.find(item => item.id===id)
    oldNews.tags = new Set(news.tags)
    oldNews.publicationDate = news.publicationDate ?? (oldNews.state === State.draft && news.state === State.published && new Date())
    oldNews.state = news.state
    oldNews.header = news.header
    oldNews.description = news.description
  }

  public static deleteNews(id: number) {
    Storage.news = Storage.news.filter(item => item.id !== id)
  }
}
