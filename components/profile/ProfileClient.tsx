'use client'

// @TASK P4-프로필 - 유저 공개 프로필 클라이언트

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { UserProfile, UserHolding } from '@/lib/profile/mock-data'
import { MOCK_POSTS, MOCK_GLOBAL_POSTS } from '@/lib/community/mock-data'
import { formatRelativeTime } from '@/lib/community/format-time'

interface Props {
  profile: UserProfile
  holdings: UserHolding[]
  currentUserId?: string
}

type Tab = 'posts' | 'holdings'

function ReturnPctBadge({ avgPrice, currentPrice }: { avgPrice: number; currentPrice: number }) {
  const pct = ((currentPrice - avgPrice) / avgPrice) * 100
  const isPositive = pct >= 0
  return (
    <span
      className={`text-xs font-semibold ${isPositive ? 'text-red-500' : 'text-blue-500'}`}
    >
      {isPositive ? '+' : ''}{pct.toFixed(2)}%
    </span>
  )
}

export default function ProfileClient({ profile, holdings, currentUserId }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('posts')
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followersCount, setFollowersCount] = useState(profile.followers_count)

  const isSelf = currentUserId === profile.id

  // 이 유저가 작성한 게시글 (MOCK_POSTS + MOCK_GLOBAL_POSTS에서 필터)
  const userPosts = [
    ...MOCK_POSTS.filter((p) => p.author.id === profile.id),
    ...MOCK_GLOBAL_POSTS.filter((p) => p.author.id === profile.id),
  ]

  async function handleFollow() {
    setFollowLoading(true)
    try {
      const res = await fetch(`/api/users/${profile.id}/follow`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json() as { following: boolean }
        setFollowing(data.following)
        setFollowersCount((prev) => data.following ? prev + 1 : Math.max(0, prev - 1))
      } else if (res.status === 401) {
        router.push('/auth')
      }
    } catch {
      // mock 토글
      setFollowing((prev) => !prev)
      setFollowersCount((prev) => !following ? prev + 1 : Math.max(0, prev - 1))
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 mr-1 text-lg"
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-base font-bold text-gray-900">프로필</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        {/* 프로필 헤더 */}
        <div className="bg-white px-6 pt-8 pb-6 flex flex-col items-center text-center">
          {/* 아바타 */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm"
            style={{ backgroundColor: profile.avatar_color }}
            aria-hidden="true"
          >
            <span className="text-white text-3xl font-bold select-none">
              {profile.nickname.slice(0, 1)}
            </span>
          </div>

          {/* 닉네임 */}
          <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.nickname}</h2>

          {/* bio */}
          {profile.bio && (
            <p className="text-sm text-gray-500 mb-4">{profile.bio}</p>
          )}

          {/* 팔로워/팔로잉 */}
          <div className="flex gap-8 mb-5">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-900">{followersCount}</span>
              <span className="text-xs text-gray-400 mt-0.5">팔로워</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-gray-900">{profile.following_count}</span>
              <span className="text-xs text-gray-400 mt-0.5">팔로잉</span>
            </div>
          </div>

          {/* 팔로우 버튼 or 프로필 편집 */}
          {isSelf ? (
            <Link
              href="/my"
              className="px-6 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              프로필 편집
            </Link>
          ) : (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
                following
                  ? 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  : 'bg-[#3182F6] text-white hover:bg-blue-700'
              }`}
            >
              {following ? '팔로잉 ✓' : '팔로우'}
            </button>
          )}
        </div>

        {/* 탭 */}
        <div className="bg-white border-b border-gray-100 flex">
          {(['posts', 'holdings'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab ? 'text-[#3182F6]' : 'text-gray-400'
              }`}
            >
              {tab === 'posts' ? '게시글' : '보유종목'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3182F6] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="px-3 py-3">
          {activeTab === 'posts' && (
            <div className="flex flex-col gap-2">
              {userPosts.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">작성한 게시글이 없습니다.</p>
              ) : (
                userPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.ticker_id}/${post.id}`}
                    className="block bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#3182F6]">{post.ticker_id}</span>
                      <span className="text-xs text-gray-400">{formatRelativeTime(post.created_at)}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>👍 {post.like_count}</span>
                      <span>💬 {post.comment_count}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'holdings' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {!profile.holdings_public ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <span className="text-2xl mb-3" aria-hidden="true">🔒</span>
                  <p className="text-sm text-gray-500">비공개 설정입니다.</p>
                </div>
              ) : holdings.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">보유 종목이 없습니다.</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {holdings.map((holding) => (
                    <li key={holding.symbol} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{holding.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{holding.symbol} · {holding.quantity}주</p>
                      </div>
                      <div className="text-right">
                        <ReturnPctBadge avgPrice={holding.avg_price} currentPrice={holding.current_price} />
                        <p className="text-xs text-gray-400 mt-0.5">
                          {holding.current_price.toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
