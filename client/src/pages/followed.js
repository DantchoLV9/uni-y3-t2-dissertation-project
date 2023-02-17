import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import LoadingScreen from '@/components/LoadingScreen'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import levelColors from '../lib/levelColors'

export default function Followed() {
    const { user } = useAuth({ middleware: 'auth' })
    const [followedUsers, setFollowedUser] = useState(null)
    useEffect(() => {
        axios
            .get(`/api/follows-list`)
            .then(results => {
                //console.log(results.data)
                results.data.forEach(followedUser => {
                    followedUser.user.color = levelColors.filter(
                        item =>
                            parseInt(item.level) === followedUser.user.level,
                    )[0]?.color
                    followedUser.date = new Date(
                        followedUser.date,
                    ).toLocaleString('default', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                })
                setFollowedUser(results.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])
    return (
        <>
            {user ? (
                <AppLayout pageTitle="Users you've followed">
                    <div className="py-12">
                        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-3">
                            <div
                                className={`bg-white overflow-hidden shadow-sm sm:rounded-lg`}>
                                <div className=" bg-white border-b border-gray-200 flex flex-col">
                                    <div className="p-6 flex flex-col">
                                        <h1 className="font-bold text-xl">
                                            Users you've followed
                                        </h1>
                                        {followedUsers === null
                                            ? 'Loading'
                                            : followedUsers?.length > 0
                                            ? followedUsers.map(
                                                  (followedUser, i) => (
                                                      <div
                                                          key={`followed-users-list-item-${i}`}
                                                          className="mt-2 flex justify-between items-center">
                                                          <div className="flex items-center gap-2">
                                                              <div
                                                                  className={`flex-shrink-0 border-2 border-${followedUser.user.color} rounded-full p-1.5`}>
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
                                                                  <Link
                                                                      href={`user/${followedUser.user.slug}`}>
                                                                      <a className="font-bold">
                                                                          {
                                                                              followedUser
                                                                                  .user
                                                                                  .name
                                                                          }
                                                                      </a>
                                                                  </Link>
                                                              </p>
                                                          </div>
                                                          <p className="text-sm flex flex-col justify-center items-center">
                                                              Followed on:
                                                              <span className="font-bold">
                                                                  {
                                                                      followedUser.date
                                                                  }
                                                              </span>
                                                          </p>
                                                      </div>
                                                  ),
                                              )
                                            : 'No one followed by you yet'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AppLayout>
            ) : (
                <LoadingScreen />
            )}
        </>
    )
}
