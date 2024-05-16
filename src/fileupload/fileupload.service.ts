import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class FileuploadService {
  async compressAndSavePdf(file: Express.Multer.File): Promise<string> {
    console.log(__dirname);
    // const filePath = resolve(__dirname, '..', 'uploads', file.originalname);
    const filePath = resolve('/home/aa/', 'uploads', file.originalname);

    // Save the uploaded file
    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      writeStream.write(file.buffer);
      writeStream.end();
    });

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(file.buffer);

    // Compress the PDF
    const compressedPdfBytes = await pdfDoc.save();

    // Write the compressed PDF to a new file
    const compressedFilePath = resolve(
      __dirname,
      '..',
      'uploads',
      `compressed_${file.originalname}`,
    );
    await new Promise((resolve, reject) => {
      const writeStream = createWriteStream(compressedFilePath);
      writeStream.on('error', reject);
      writeStream.on('finish', resolve);
      writeStream.write(compressedPdfBytes);
      writeStream.end();
    });

    // Optionally, you can delete the original uncompressed file
    // await fs.promises.unlink(filePath);

    return compressedFilePath;
  }
}
