# ระบบบันทึกข้อมูลรถบุคลากรวิทยาลัยเทคนิคเลย (staffcar)

**ผู้จัดทำ:** อชิรวิชญ์ พวงพิลา | **รหัสนักศึกษา:** 68319010033 | **กลุ่มเรียน:** ปวส2/3

![CI](https://github.com/68319010033/midterm-devops-staffcar-67xxxxxxxx/actions/workflows/ci.yml/badge.svg)

ระบบ CRUD สำหรับบันทึกข้อมูลรถของบุคลากร เพื่อออกสติกเกอร์เข้า-ออกวิทยาลัย

## API Endpoints
| Method | Path | คำอธิบาย |
|---|---|---|
| GET | /api/cars | ดูรายการรถทั้งหมด |
| GET | /api/cars/:id | ดูรถตาม id |
| POST | /api/cars | เพิ่มรถใหม่ |
| PUT | /api/cars/:id | แก้ไขข้อมูลรถ |
| DELETE | /api/cars/:id | ลบข้อมูลรถ |
| GET | /health | เช็คสถานะ API |

## วิธีรัน (Dev)
\`\`\`bash
cp backend/.env.example backend/.env
docker compose up -d --build
\`\`\`
เปิด http://localhost:8080

## วิธีรัน (Production — จาก Docker Hub)
\`\`\`bash
docker compose -f docker-compose.prod.yml up -d
\`\`\`

Docker Hub: https://hub.docker.com/r/yourdockerhub/staffcar-api

[CI](https://github.com/68319010033-tech/midterm-devops-staffcar-68319010033/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/68319010033-tech/midterm-devops-staffcar-68319010033/actions/workflows/cd.yml/badge.svg)
