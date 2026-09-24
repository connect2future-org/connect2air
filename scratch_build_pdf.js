import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

async function generatePDF() {
  const doc = new jsPDF('p', 'mm', 'a4');

  const page1Path = path.join(process.cwd(), 'public/assets/brochure/page1.png');
  const page2Path = path.join(process.cwd(), 'public/assets/brochure/page2.png');
  const page3Path = path.join(process.cwd(), 'public/assets/brochure/page3.png');

  const img1 = fs.readFileSync(page1Path).toString('base64');
  const img2 = fs.readFileSync(page2Path).toString('base64');
  const img3 = fs.readFileSync(page3Path).toString('base64');

  doc.addImage(`data:image/png;base64,${img1}`, 'PNG', 0, 0, 210, 297);
  doc.addPage();
  doc.addImage(`data:image/png;base64,${img2}`, 'PNG', 0, 0, 210, 297);
  doc.addPage();
  doc.addImage(`data:image/png;base64,${img3}`, 'PNG', 0, 0, 210, 297);

  const pdfOutput = doc.output('arraybuffer');
  const outputPath = path.join(process.cwd(), 'public/Connect2Air_Drone_Brochure.pdf');
  fs.writeFileSync(outputPath, Buffer.from(pdfOutput));
  console.log('Successfully created public/Connect2Air_Drone_Brochure.pdf');
}

generatePDF().catch(console.error);
