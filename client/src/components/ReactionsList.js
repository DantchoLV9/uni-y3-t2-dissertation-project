import React, { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import levelColors from '../lib/levelColors'
import Link from 'next/link'
import LikeIcon from '@/images/likeIcon'
import UnlikeIcon from '@/images/unlikeIcon'
import HeartIcon from '@/images/heartIcon'
import StarIcon from '@/images/starIcon'
import CrossIcon from '@/images/crossIcon'

const ReactionsList = ({ post, close }) => {
    const [reactionsList, setReactionsList] = useState(null)
    useEffect(() => {
        axios
            .get(`/api/reactions-list?id=${post.id}`)
            .then(results => {
                console.log(results.data)
                results.data.forEach(reaction => {
                    reaction.user.color = levelColors.filter(
                        item => parseInt(item.level) === reaction.user.level,
                    )[0]?.color
                    let reactionColor = null
                    switch (reaction.reaction_type) {
                        case 0:
                            reactionColor = 'text-violet-600'
                            break
                        case 1:
                            reactionColor = 'text-yellow-600'
                            break
                        case 2:
                            reactionColor = 'text-pink-600'
                            break
                        case 3:
                            reactionColor = 'text-red-600'
                            break
                    }
                    reaction.reactionColor = reactionColor
                })
                setReactionsList(results.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [post])
    return (
        <div className="flex flex-col gap-2">
            {reactionsList !== null && (
                <div className="flex justify-center items-center">
                    <p>Reactions</p>
                    <button
                        onClick={close}
                        aria-label="close reactions list"
                        title="close reactions list"
                        className="ml-auto hover:bg-gray-100 p-0.5 rounded-full">
                        <CrossIcon />
                    </button>
                </div>
            )}
            <div className="flex flex-col gap-2">
                {reactionsList === null
                    ? 'Loading'
                    : reactionsList?.length > 0
                    ? reactionsList.map((reaction, i) => (
                          <div
                              className="flex justify-between items-center gap-2"
                              key={`reactions-list-${post.id}-${i}`}>
                              <div className="flex justify-between items-center gap-2">
                                  <div
                                      className={`flex-shrink-0 border-2 border-${reaction.user.color} rounded-full p-1.5`}>
                                      <svg
                                          className="h-6 w-6 fill-current text-gray-600"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor">
                                          <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                          />
                                      </svg>
                                  </div>
                                  <p>
                                      <Link href={`user/${reaction.user.slug}`}>
                                          <a className="font-bold">
                                              {reaction.user.name}
                                          </a>
                                      </Link>{' '}
                                      reacted with{' '}
                                  </p>
                              </div>
                              <p className={`${reaction.reactionColor}`}>
                                  {reaction.reaction_type === 0 && <LikeIcon />}
                                  {reaction.reaction_type === 1 && <StarIcon />}
                                  {reaction.reaction_type === 2 && (
                                      <HeartIcon />
                                  )}
                                  {reaction.reaction_type === 3 && (
                                      <UnlikeIcon />
                                  )}
                              </p>
                          </div>
                      ))
                    : 'No reactions yet'}
            </div>
        </div>
    )
}

export default ReactionsList
