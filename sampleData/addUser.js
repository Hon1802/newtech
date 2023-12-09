import { handleAddUser, 
    } from "../src/services/userService.js";
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; 
    const worksheet = workbook.Sheets[sheetName];
    const headers = {};
    const data = [];
    // Duyệt qua mỗi ô trong sheet
    for (const cell in worksheet) {
        if (cell[0] === '!') continue;

        // Lấy giá trị của ô và chỉ mục cột/dòng
        const cellValue = worksheet[cell].v;
        const cellIndex = XLSX.utils.decode_cell(cell);

        // Lưu chỉ mục của các cột theo tiêu đề
        if (cellIndex.r === 0) {
            headers[cellIndex.c] = cellValue;
            continue;
        }

        // Tạo object dữ liệu với các giá trị tương ứng theo cột tiêu đề
        const rowData = {};
        for (let i = 0; i < Object.keys(headers).length; i++) {
            const header = headers[i];
            const cellData = worksheet[XLSX.utils.encode_cell({ r: cellIndex.r, c: i })];
            rowData[header] = cellData ? cellData.v : '';
        }
        data.push(rowData);
    }
    return data;
}

// Sử dụng hàm readExcel
const filePath = path.join(__dirname, 'user.xlsx');
// console.log(excelData); // In ra dữ liệu từ file Excel theo cột tiêu đề
export const upload = async() => { 
    const data = await readExcel(filePath);
    const uniqueIds = new Set();
    data.forEach(row =>{
        if (!uniqueIds.has(row.id)) {
            uniqueIds.add(row.id);
            console.log(row.id);     
            let id_User = row.id_User; 
            let name = row.Name;
            let email = row.email;
            let phone = row.phone;
            let major = row.major;
            let role = row.role;
            let stClass = row.class; 
            let gender = row.gender;
            let facility = row.facility;
            let urlImage = row.urlImage;
            let status = row.status;
            let token = 'expired';
            const unixTime = (row.Dob - 25569) * 86400 * 1000;
            const dateValue = new Date(unixTime);
            const dateObj = new Date(dateValue); 
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); 
            const day = dateObj.getDate().toString().padStart(2, '0'); 
            const year = dateObj.getFullYear(); // Lấy năm
            const formattedDate = `${month}-${day}-${year}`; 
            let Dob = formattedDate; 
            
            handleAddUser( 
                id_User,
                name, 
                Dob,
                email,
                phone,
                major,
                role,
                stClass,
                facility,
                gender, 
                urlImage,
                token,
                status
                );
                
        }
    })
} 
