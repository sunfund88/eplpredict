import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    // ลองเปลี่ยนบรรทัดนี้เป็น process.env.DIRECT_URL ชั่วคราว 
    // เพื่อเช็คว่าคำสั่ง migrate จะทำงานผ่านพอร์ต 5432 ได้ไหม
    url: process.env.DIRECT_URL, 
  },
});