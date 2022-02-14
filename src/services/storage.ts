import { AuthData, Role } from '../entities/AuthData'
import News, { State } from '../entities/News'
import User from '../entities/User'

export default class Storage {
  public static news: News[] = []
  public static users: Map<number, User> = new Map<number, User>() // by id
  public static tags: Set<string> = new Set<string>()
  public static authorities: Map<string, AuthData> = new Map<string, AuthData>() // by string 'user@password'
  public static authorized: Map<string, AuthData> = new Map<string, AuthData>() // by token
  public static admins: User[] = []

  private static newsIndex: number = 1
  private static userIndex: number = 1

  public static get publishedNews() {
    return Storage.news.filter(n => n.state === State.published && n.publicationDate > new Date())
  }

  public static addNews(item: News) {
    const id = this.newsIndex++
    this.news.push({...item, id})
    return id
  }

  public static addUser(item: User) {
    const id = this.userIndex++
    this.users.set(id, {...item, id})
    return id
  }

  public static addDefaultAdmin() {
    const id = Storage.userIndex++
    this.users.set(
      id,
      {
        id,
        firstName: '-',
        lastName: '-',
        nickname: '-',
        tags: [],
        readNewsList: new Set<number>(),
        myNewsList: []
      }
    )
    this.authorities.set(
      'admin@admin',
      {
        login: 'admin',
        password: 'admin',
        role: Role.admin,
        userId: id
      }
    )
  }
}
