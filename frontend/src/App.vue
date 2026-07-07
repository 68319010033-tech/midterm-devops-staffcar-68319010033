<template>
  <div class="container">
    <h1>🚗 ระบบบันทึกข้อมูลรถบุคลากร (staffcar)</h1>

    <form @submit.prevent="submitForm">
      <input v-model="form.plate_no" placeholder="ทะเบียนรถ *" required>
      <select v-model="form.type" required>
        <option value="" disabled>-- ประเภท --</option>
        <option value="รถยนต์">รถยนต์</option>
        <option value="รถจักรยานยนต์">รถจักรยานยนต์</option>
      </select>
      <input v-model="form.brand_model" placeholder="ยี่ห้อ/รุ่น">
      <input v-model="form.color" placeholder="สี">
      <input v-model="form.owner" placeholder="ชื่อเจ้าของ">
      <input v-model="form.department" placeholder="แผนก">
      <select v-model="form.status">
        <option value="รอออก">รอออก</option>
        <option value="ออกแล้ว">ออกแล้ว</option>
        <option value="หมดอายุ">หมดอายุ</option>
      </select>
      <button type="submit">💾 {{ editingId ? 'บันทึกการแก้ไข' : 'เพิ่มรถ' }}</button>
      <button type="button" @click="resetForm">ล้างฟอร์ม</button>
    </form>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-if="loading">กำลังโหลด...</p>

    <table v-else>
      <thead>
        <tr>
          <th>ทะเบียน</th><th>ประเภท</th><th>ยี่ห้อ/รุ่น</th><th>สี</th>
          <th>เจ้าของ</th><th>แผนก</th><th>สถานะ</th><th>จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td>{{ car.plate_no }}</td>
          <td>{{ car.type }}</td>
          <td>{{ car.brand_model || '-' }}</td>
          <td>{{ car.color || '-' }}</td>
          <td>{{ car.owner || '-' }}</td>
          <td>{{ car.department || '-' }}</td>
          <td>{{ car.status }}</td>
          <td>
            <button class="btn-edit" @click="editCar(car)">แก้ไข</button>
            <button class="btn-del" @click="deleteCar(car.id)">ลบ</button>
          </td>
        </tr>
        <tr v-if="cars.length === 0">
          <td colspan="8" style="text-align:center;">ยังไม่มีข้อมูลรถ</td>
        </tr>
      </tbody>
    </table>

    <footer>จัดทำโดย: อชิรวิชญ์ พวงพิลา | รหัสนักศึกษา: 68319010033 | staffcar API v1.0.0</footer>
  </div>
</template>

<script>
const API_URL = '/api/cars';

const emptyForm = () => ({
  plate_no: '', type: '', brand_model: '', color: '',
  owner: '', department: '', status: 'รอออก',
});

export default {
  data() {
    return {
      cars: [],
      form: emptyForm(),
      editingId: null,
      loading: false,
      errorMsg: '',
    };
  },
  mounted() {
    this.loadCars();
  },
  methods: {
    async loadCars() {
      this.loading = true;
      this.errorMsg = '';
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');
        this.cars = await res.json();
      } catch (err) {
        this.errorMsg = 'เชื่อมต่อ API ไม่ได้: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      this.errorMsg = '';
      const url = this.editingId ? `${API_URL}/${this.editingId}` : API_URL;
      const method = this.editingId ? 'PUT' : 'POST';
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'บันทึกไม่สำเร็จ');
        }
        this.resetForm();
        await this.loadCars();
      } catch (err) {
        this.errorMsg = err.message;
      }
    },
    editCar(car) {
      this.editingId = car.id;
      this.form = { ...car };
    },
    async deleteCar(id) {
      if (!confirm('ยืนยันลบรายการนี้?')) return;
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await this.loadCars();
    },
    resetForm() {
      this.form = emptyForm();
      this.editingId = null;
    },
  },
};
</script>

<style>
body { font-family: sans-serif; }
.container { max-width: 950px; margin: 2rem auto; padding: 0 1rem; }
h1 { color: #2c3e50; }
form { display: flex; flex-wrap: wrap; gap: 6px; background: #f5f5f5; padding: 1rem; border-radius: 8px; }
input, select { padding: 6px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
button[type="submit"] { background: #2c3e50; color: white; }
table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 0.9rem; }
th { background: #2c3e50; color: white; }
.btn-edit { background: #f39c12; color: white; }
.btn-del { background: #e74c3c; color: white; }
.error { color: #e74c3c; font-weight: bold; }
footer { margin-top: 2rem; color: #666; font-size: 0.85rem; text-align: center; }
</style>