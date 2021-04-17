import { AccessToken } from './classes/AccessToken'
import { RefreshToken } from './classes/RefreshToken'

export const getAuthTokens = async (userId: Number) => {
  const _accessToken = new AccessToken(userId)
  const newAccessToken = await _accessToken.generate()

  const _refreshToken = new RefreshToken(userId)
  const newRefreshToken = await _refreshToken.generate()

  return {
    newAccessToken,
    newRefreshToken
  }
}