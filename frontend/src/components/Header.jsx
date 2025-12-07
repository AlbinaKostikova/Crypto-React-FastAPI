import React from 'react'
import { Button } from 'antd'
import { RadarChartOutlined, FireOutlined, CrownOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 shadow-2xl px-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-lg opacity-30"></div>
          <RadarChartOutlined className="relative z-10 text-3xl text-cyan-400" />
        </div>

        <div>
          <h1 className="m-0 text-xl font-black bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            CRYPTOSPHERE
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">LIVE MARKET DATA</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 group cursor-pointer">
          <FireOutlined className="text-orange-500 group-hover:animate-pulse text-sm" />
          <span className="text-gray-300 group-hover:text-white transition-colors font-medium text-sm">
            Trending
          </span>
        </div>

        <div className="flex items-center gap-2 group cursor-pointer">
          <CrownOutlined className="text-yellow-500 text-sm" />
          <span className="text-gray-300 group-hover:text-white transition-colors font-medium text-sm">
            Top 10
          </span>
        </div>

        <div className="relative group">
          <Button
            type="primary"
            className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 font-bold hover:opacity-90 text-sm"
            icon={<RadarChartOutlined className="text-sm" />}>
            AI Analysis
          </Button>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">TOTAL CAPITALIZATION</div>
            <div className="text-base font-bold text-white">$2.1T</div>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors">
            24h VOL: $78.4B
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button className="px-4 ml-5 py-1.5 rounded-md bg-transparent border border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-200 group">
            <div className="flex items-center gap-2">
              <UserAddOutlined className="text-gray-400 group-hover:text-cyan-400 transition-colors text-xs" />
              <span className="text-xs font-medium text-gray-300 group-hover:text-cyan-300 transition-colors">
                Register
              </span>
            </div>
          </button>

          <button className="px-4 mx-5 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/30">
            <div className="flex items-center gap-2">
              <LoginOutlined className="text-white text-xs" />
              <span className="text-xs font-bold text-white">Log In</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header