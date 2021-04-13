import Cookies from 'universal-cookie'

const cookies = {
  get: (cookiesRequest: string | undefined, name: string) => {
    const cookies = new Cookies(cookiesRequest)
    
    return cookies.get(name)
  }
}

export default cookies