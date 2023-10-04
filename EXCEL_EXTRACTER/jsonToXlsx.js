//This part is to create xlsx file and write the json serach result we have filtered into it using XLSX package

import XLSX from "xlsx";

export const convertJsonToExcel=(jsonData,date)=>{

    //removing null || undefined objects from json
    const filteredJsonObject=jsonData.filter((elements)=>{
        return (elements != null && elements !== undefined && elements !== "")
    })

    const workSheet=XLSX.utils.json_to_sheet(filteredJsonObject)
    const workBook=XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workBook,workSheet,"Guests")

    //Generate Buffer
    XLSX.write(workBook,{bookType:'xlsx',type:'binary'})

    //Convert to binary string
    XLSX.write(workBook,{bookType:'xlsx',type:'binary'})

    XLSX.writeFile(workBook,`guest_detail_${date}.xlsx`) //appending date to create unique file name


}