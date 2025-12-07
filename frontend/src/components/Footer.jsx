import React from 'react';
import { 
  TwitterOutlined, 
  GithubOutlined, 
  TelegramOutlined, 
  MailOutlined,
  GlobalOutlined,
  HeartOutlined
} from '@ant-design/icons';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-black border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-8">
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <GlobalOutlined className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold text-white">CRYPTOSPHERE</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Аналитика крипторынка в реальном времени. 
              Данные, тренды и прогнозы.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Навигация</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white text-sm">Рынок</a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm">Топ 10</a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm">Аналитика</a>
              <a href="#" className="block text-gray-400 hover:text-white text-sm">О проекте</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Контакты</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white text-sm">
                <MailOutlined className="mr-2" /> support@cryptosphere.com
              </a>
              <p className="text-gray-400 text-sm">Круглосуточная поддержка</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="text-gray-400 hover:text-blue-400 text-xl">
            <TwitterOutlined />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-300 text-xl">
            <GithubOutlined />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-500 text-xl">
            <TelegramOutlined />
          </a>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Cryptosphere. Все права защищены.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Сделано с <HeartOutlined className="text-red-500 mx-1" /> для криптосообщества
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;