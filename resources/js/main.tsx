import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import router from './routes'
import { ConfigProvider, message, notification } from 'antd'

// Configure global toast message & notification placement to top-right
message.config({
  top: 24,
  duration: 3.5,
  maxCount: 4,
});

notification.config({
  placement: 'topRight',
  top: 24,
  duration: 4.5,
});

const getPrimaryColor = () => {
  if (typeof window !== 'undefined') {
    const val = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    if (val) return val;
  }
  return '#4353ff';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          cssVar: true,
          token: {
            colorPrimary: getPrimaryColor(),
            borderRadius: 12,
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
