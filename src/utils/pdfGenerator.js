import jsPDF from 'jspdf'

export const generatePDF = (title, dataLines, fileName = 'document.pdf') => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.setTextColor(0, 128, 128) // Teal color
    doc.text(title, 20, 20)

    // Line separating title
    doc.setLineWidth(0.5)
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 25, 190, 25)

    // Content
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)

    let y = 35
    const lineHeight = 10

    dataLines.forEach(line => {
        // Check if new page is needed
        if (y > 280) {
            doc.addPage()
            y = 20
        }

        // Handle string vs object (label/value)
        if (typeof line === 'string') {
            doc.text(line, 20, y)
        } else if (line.label && line.value) {
            doc.setFont('helvetica', 'bold')
            doc.text(`${line.label}:`, 20, y)
            doc.setFont('helvetica', 'normal')
            doc.text(`${line.value}`, 70, y)
        }

        y += lineHeight
    })

    // Footer
    const date = new Date().toLocaleDateString()
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text(`Generated on ${date} from Health Portal`, 20, 285)

    doc.save(fileName)
}
