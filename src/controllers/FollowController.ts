import { Request, Response } from 'express'

import knex from '../database/connection'

class FollowController{
  async follow(request: Request, response: Response){
    const userId = request.userId
    const followedUserId = request.params.id
    
    const userExists = await knex.select('*').from('users').where({id: userId}).first()

    if (!userExists){
      return response.status(400).json({errorMessage: 'This user does not exists'})
    }

    const followedUserExists = await knex.select('*').from('users').where({id: followedUserId}).first()

    if (!followedUserExists){
      return response.status(400).json({errorMessage: 'User not found'})
    }

    if (userExists.id === followedUserExists.id){
      return response.status(400).json({errorMessage: 'You can not follow yourself'})
    }

    await knex('users').update({
      following_count: userExists.following_count + 1
    }).where({id: userExists.id})
    await knex('users').update({
      followers_count: followedUserExists.followers_count + 1
    }).where({id: followedUserExists.id})
    await knex('follow_users').insert({
      user_id: userExists.id,
      followed_user: followedUserExists.id
    })

    return response.status(200).json({message: 'User was followed'})
  }
  async unfollow(request: Request, response: Response){
    const userId = request.userId
    const unfollowedUserId = request.params.id

    const userIsFollowed = await knex.select('*').from('follow_users').where({
      user_id: userId
    }).andWhere({
      followed_user: unfollowedUserId
    })
    
    if (!userIsFollowed){
      return response.status(400).json({errorMessage: 'User is not followed by you'})
    }

    const user = await knex.select('id', 'following_count').from('users').where({id: userId}).first()
    const unfollowedUser = await knex.select('id', 'followers_count').from('users').where({id: unfollowedUserId}).first()
    
    await knex('users').update({
      following_count: user.following_count - 1
    }).where({id: user.id})
    await knex('users').update({
      followers_count: unfollowedUser.followers_count - 1
    }).where({id: unfollowedUser.id})
    await knex('follow_users').del().where({
      user_id: user.id}).andWhere({followed_user: unfollowedUser.id
    })

    return response.status(200).json({message: 'User was unfollowed'})
  }
  async listFollowers(request: Request, response: Response){
    const userId = request.userId

    const followers = await knex.select('users.name', 'users.username').from('follow_users')
      .where({followed_user: userId})
      .join('users', 'follow_users.user_id', '=', 'users.id')

    return response.status(200).json(followers)
  }
  async listFollowing(request: Request, response: Response){
    const userId = request.userId

    const following = await knex.select('users.name', 'users.username').from('follow_users')
      .where({user_id: userId})
      .join('users', 'follow_users.followed_user', '=', 'users.id')

    return response.status(200).json(following)
  }
}

export default new FollowController