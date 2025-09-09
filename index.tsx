// index.tsx
// ไฟล์นี้เป็นจุดเริ่มต้น (Entry Point) ของแอปพลิเคชัน React

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ค้นหา element ที่มี id 'root' ใน DOM เพื่อใช้เป็นคอนเทนเนอร์หลักของแอป
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// สร้าง root ของ React เพื่อจัดการการ render ใน element ที่เลือก
const root = ReactDOM.createRoot(rootElement);

// ทำการ Render คอมโพเนนต์ App ภายใน React.StrictMode
// StrictMode ช่วยในการตรวจจับปัญหาที่อาจเกิดขึ้นในแอปพลิเคชัน
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);