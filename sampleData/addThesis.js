import { handleAddThesis
} from "../src/services/thesisService.js";
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
const filePath = path.join(__dirname, 'thesis.xlsx');
// console.log(excelData); // In ra dữ liệu từ file Excel theo cột tiêu đề
export const uploadThesis = async() => { 
    const data = await readExcel(filePath);
    const uniqueIds = new Set();
    function convertDate(params) {
        let unixTime = (params - 25569) * 86400 * 1000;
        let dateValue = new Date(unixTime);
        let dateObj = new Date(dateValue); 
        let month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); 
        let day = dateObj.getDate().toString().padStart(2, '0'); 
        let year = dateObj.getFullYear(); // Lấy năm
        let formattedDate = `${month}-${day}-${year}`; 
        return formattedDate;
    }
    data.forEach(row =>{
        if (!uniqueIds.has(row.id)) { 
            uniqueIds.add(row.id);
            console.log(row.id);      
            let title = row.title; 
            let academic_year = row.academic_year;
            let code = row.code;
            let description = row.description;
            let author = row.author;
            let industry = row.industry;
            if(author)
            {
                author = JSON.parse(author); 
            }
            let member_1 = row.member_1;
            let member_2 = row.member_2;
            let member_3 = row.member_3;
            let member = member_1;
            if(member_2){
                member = member + ','+member_2;
            }
            if(member_3)
            {
                member = member + ','+member_3;
            }
            if(member)
            { 
                member = JSON.parse(member);
            }  
            let instructor = row.instructor; 
            if(instructor)
            { 
                instructor = JSON.parse(instructor); 
            }
            let result = row.result;
            let type = row.type;
            let status = row.status;
            let time_start = row.time_start;
            // console.log(convertDate(time_start)); 
            let time_end = row.time_end; 
            let reference = '[{"reference": "100100"}]';
            if(reference)
            { 
                reference = JSON.parse(reference); 
            }  
            // console.log(convertDate(time_end));
            handleAddThesis(title,
                            code,
                            industry,
                            description,
                            academic_year,
                            time_start,
                            time_end,
                            author,
                            member,
                            instructor,
                            type,
                            result,
                            reference,
                            status );
            console.log('oke');
        
        }
    })  
} 
