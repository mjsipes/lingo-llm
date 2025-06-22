// app/api/export-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(req: NextRequest) {
  const { messages, images } = await req.json();

  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const textWidth = pageWidth - (margin * 2);

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('My Spanish Learning Adventure', margin, yPosition);
  yPosition += 15;

  // Add a line separator
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Process messages
  doc.setFontSize(12);
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Set different styles for user vs assistant
    if (message.role === 'user') {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 200); // Blue for user
      doc.text('You:', margin, yPosition);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 100, 0); // Orange for assistant
      doc.text('Pingu:', margin, yPosition);
    }
    
    yPosition += 8;
    
    // Reset to normal text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Split long text into multiple lines
    const lines = doc.splitTextToSize(message.content, textWidth);
    for (const line of lines) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin + 10, yPosition);
      yPosition += 6;
    }
    
    yPosition += 8; // Extra space between messages
  }

  // Add images section
  if (images.length > 0) {
    // Add new page for images
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Story Artwork', margin, yPosition);
    yPosition += 20;

    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      
      try {
        // Fetch image as base64
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64}`;
        
        // Calculate image dimensions (max 150x150)
        const maxWidth = 150;
        const maxHeight = 150;
        
        // Check if we need a new page
        if (yPosition + maxHeight > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Add image
        doc.addImage(dataUri, 'JPEG', margin, yPosition, maxWidth, maxHeight);
        
        // Add image caption
        doc.setFontSize(10);
        doc.text(`Artwork ${i + 1}`, margin, yPosition + maxHeight + 10);
        
        yPosition += maxHeight + 25;
        
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        // Add placeholder text if image fails
        doc.setFontSize(10);
        doc.text(`[Image ${i + 1} - could not load]`, margin, yPosition);
        yPosition += 15;
      }
    }
  }

  // Generate PDF buffer
  const pdfBuffer = doc.output('arraybuffer');
  
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="my-spanish-story.pdf"',
      'Content-Length': pdfBuffer.byteLength.toString(),
    },
  });
}