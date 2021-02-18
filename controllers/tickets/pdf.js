import PDFDocument  from 'pdfkit'
import moment from 'moment'


const prueba =  (req,res) => {
    const {startDate, endDate, userName, noSolucionado, solucionado, total, role} = req.body;
    const data = {
        startDate: moment(startDate,'YYYY-MM-DD').format('DD-MM-YYYY'),
        endDate: moment(endDate,'YYYY-MM-DD').format('DD-MM-YYYY'),
        userName: userName,
        role: role,
        noSolucionado: noSolucionado,
        solucionado: solucionado,
        total: total
    }
    let filename = "report";
    filename = encodeURIComponent(filename) + '.pdf';
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    createInform(data,res)
   

}
const createInform = (data,res) => {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
    
    generateHeader(doc)
    generateCustomerInformation(doc,data)
    generateTicketTable(doc,data)
    doc.pipe(res)
    doc.end();
}


const generateHeader = (doc) => {
    doc
        .image("public/img/sigef-logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(15)
            .text("SIGEF", 110, 57)
            .text("Ministerio de Educacion", 110,70)
        .fontSize(10)
        .text("Juan José Silva 57", 200, 65, { align: "right" })
        .text("Formosa Argenina", 200, 80, { align: "right" })
        .moveDown();
}

const generateCustomerInformation = (doc, data) => {
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Situacion de Tickets", 50, 160);
  
    generateHr(doc, 185);
  
    const customerInformationTop = 200;
  
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Periodo:", 50, customerInformationTop)
      .text("Cantidad de Tickets:", 50, customerInformationTop + 15)
      .font("Helvetica")
      .text(`${data.startDate} - ${data.endDate} ` , 100, customerInformationTop)
      .text(data.total, 150, customerInformationTop + 15)
      
  
      .font("Helvetica-Bold")
      .text("Usuario:", 300, customerInformationTop)
      .text("Rol:", 300, customerInformationTop + 15)
      .font("Helvetica")
      .text(data.userName, 350, customerInformationTop)
      .text(data.role, 330, customerInformationTop + 15)
      .moveDown();
  
    generateHr(doc, 252);
  }

  const  generateTicketTable =(doc, data)  => {
    const invoiceTableTop = 330;
  
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Descripcion", 50, invoiceTableTop)
      .text("Cantidad", 150, invoiceTableTop)
      .text("Total", 0, invoiceTableTop, { align: "right" });
  
    generateHr(doc, invoiceTableTop + 20);


    doc
        .font("Helvetica")
        .fontSize(10)
        .text("Tickets Solucionados", 50, invoiceTableTop+30)
        .text(data.solucionado, 150, invoiceTableTop+30)
        .text(data.solucionado, 0, invoiceTableTop+30, { align: "right" });
        generateHr(doc, invoiceTableTop + 50);

    doc
        .font("Helvetica")
        .fontSize(10)
        .text("Tickets sin Solucionar", 50, invoiceTableTop+60)
        .text(data.noSolucionado, 150, invoiceTableTop+60)
        .text(data.noSolucionado, 0, invoiceTableTop+60, { align: "right" });
        
        generateHr(doc, invoiceTableTop + 80);
    
    doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Solucionados", 300, invoiceTableTop+90, { width: 90, align: "right" })
        .text(`${data.solucionado} / ${data.total}`, 0,  invoiceTableTop+90, { align: "right" })
        .text("Sin Solucionar", 300, invoiceTableTop+110, { width: 90, align: "right" })
        .text(`${data.noSolucionado} / ${data.total}`, 0,  invoiceTableTop+110, { align: "right" });
}
    







  const  generateTableRow = (
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
  ) => {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: "right" })
      .text(quantity, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }

const generateHr = (doc, y) => {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }


  module.exports = {prueba}