export interface HouseSummary {
  farm_name: string
  house_name: string
  type: string
  sex: string
  breed: string
  status: string
  avg_weight: string
  total_qty: string
  duration_days: string
  start_date: string
  end_date: string
  food: string
  weight_target: string
  machines: machines[]
  silo: silo
  sd: string
  cv: string
  uniform: string
  cv_range: string
}

export interface machines {
  mac: string
  sn: string
}

export interface silo {
  id: string
  name: string
}

export const defaultHouseSummary: HouseSummary = {
  farm_name: '',
  house_name: '',
  type: '',
  sex: '',
  breed: '',
  status: '',
  avg_weight: '',
  total_qty: '',
  duration_days: '',
  start_date: '',
  end_date: '',
  food: '',
  weight_target: '',
  machines: [],
  silo: {
    id: '',
    name: '',
  },
  sd: '',
  cv: '',
  uniform: '',
  cv_range: '',
}

// "farm_name": "ฟาร์มลุงดำเนิน",
//     "house_name": "โรงเรือนเพาะเลี้ยงไก่เนื้อ 01",
//     "type": "ไก่เนื้อ",
//     "sex": "ผู้",
//     "breed": "พันธุ์พลีมัทร์ร็อคขาว",
//     "status": "in_progress",
//     "avg_weight": "3751.7216",
//     "total_qty": 15000,
//     "duration_days": 52,
//     "start_date": "2025-07-20T00:00:00.000Z",
//     "end_date": "2025-08-15T00:00:00.000Z",
//     "food": "1-3-5-7",
//     "weight_target": 500,
//     "machines": [
//       {
//         "mac": "142B2FC15448",
//         "sn": "SN005301000001"
//       },
//       {
//         "mac": "142B2FC15449",
//         "sn": "SN005301000002"
//       }
//     ],
//     "sd": "4144.2241",
//     "cv": "110.4619",
//     "uniform": "0.0000",
//     "cv_range": "0.5396"
