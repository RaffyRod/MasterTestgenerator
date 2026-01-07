import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType
} from 'docx'
import { jsPDF } from 'jspdf'

/**
 * Export test plan to Markdown format
 */
export function exportTestPlanToMarkdown(testPlan) {
  if (!testPlan) {
    return ''
  }

  let markdown = `# ${testPlan.title}\n\n`
  markdown += `**Type:** ${testPlan.type}\n\n`
  markdown += `---\n\n`

  // Objectives
  markdown += `## Objectives\n\n`
  testPlan.objectives.forEach((objective, index) => {
    markdown += `${index + 1}. ${objective}\n`
  })
  markdown += `\n`

  // Scope
  markdown += `## Scope\n\n`
  markdown += `### In Scope\n\n`
  testPlan.scope.inScope.forEach(item => {
    markdown += `- ${item}\n`
  })
  markdown += `\n### Out of Scope\n\n`
  testPlan.scope.outOfScope.forEach(item => {
    markdown += `- ${item}\n`
  })
  markdown += `\n`

  // Test Strategy
  markdown += `## Test Strategy\n\n`
  testPlan.testStrategy.forEach(strategy => {
    markdown += `### ${strategy.type}\n\n`
    markdown += `${strategy.description}\n\n`
  })

  // Test Items
  markdown += `## Test Items\n\n`
  testPlan.testItems.forEach(item => {
    markdown += `- **${item.id}:** ${item.name}\n`
    if (item.description && item.description !== item.name) {
      markdown += `  - ${item.description}\n`
    }
  })
  markdown += `\n`

  // Resources
  markdown += `## Resources\n\n`
  testPlan.resources.forEach(resource => {
    markdown += `- **${resource.role}:** ${resource.responsibility}\n`
  })
  markdown += `\n`

  // Schedule
  markdown += `## Schedule\n\n`
  testPlan.schedule.phases.forEach(phase => {
    markdown += `### ${phase.phase} (${phase.duration})\n\n`
    phase.activities.forEach(activity => {
      markdown += `- ${activity}\n`
    })
    markdown += `\n`
  })

  // Risks
  markdown += `## Risks and Mitigation\n\n`
  testPlan.risks.forEach(risk => {
    markdown += `### ${risk.risk}\n\n`
    markdown += `- **Impact:** ${risk.impact}\n`
    markdown += `- **Mitigation:** ${risk.mitigation}\n\n`
  })

  // Recommendations
  if (testPlan.recommendations && testPlan.recommendations.length > 0) {
    markdown += `## Recommendations\n\n`
    testPlan.recommendations.forEach((rec, index) => {
      markdown += `${index + 1}. **${rec.type}:** ${rec.message}\n`
    })
    markdown += `\n`
  }

  // Analysis Summary
  if (testPlan.analysis) {
    markdown += `## Analysis Summary\n\n`
    markdown += `- **Complexity:** ${testPlan.analysis.complexity}\n`
    markdown += `- **Estimated Test Cases:** ${testPlan.analysis.estimatedTestCases}\n`
    if (
      testPlan.analysis.detectedFunctionalities &&
      testPlan.analysis.detectedFunctionalities.length > 0
    ) {
      markdown += `- **Detected Functionalities:** ${testPlan.analysis.detectedFunctionalities.join(', ')}\n`
    }
    markdown += `\n`
  }

  return markdown
}

/**
 * Export test plan to Word Document format
 */
export async function exportTestPlanToDoc(testPlan) {
  if (!testPlan) {
    return null
  }

  const children = []

  // Title
  children.push(
    new Paragraph({
      text: testPlan.title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 }
    })
  )

  // Type
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Type: ',
          bold: true
        }),
        new TextRun({
          text: testPlan.type
        })
      ],
      spacing: { after: 200 }
    })
  )

  children.push(
    new Paragraph({
      text: '',
      spacing: { after: 200 }
    })
  )

  // Objectives
  children.push(
    new Paragraph({
      text: 'Objectives',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  )

  testPlan.objectives.forEach((objective, index) => {
    children.push(
      new Paragraph({
        text: `${index + 1}. ${objective}`,
        spacing: { after: 100 }
      })
    )
  })

  children.push(
    new Paragraph({
      text: '',
      spacing: { after: 200 }
    })
  )

  // Scope
  children.push(
    new Paragraph({
      text: 'Scope',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  )

  children.push(
    new Paragraph({
      text: 'In Scope',
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 100 }
    })
  )

  testPlan.scope.inScope.forEach(item => {
    children.push(
      new Paragraph({
        text: `• ${item}`,
        spacing: { after: 100 },
        bullet: {
          level: 0
        }
      })
    )
  })

  children.push(
    new Paragraph({
      text: 'Out of Scope',
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 100 }
    })
  )

  testPlan.scope.outOfScope.forEach(item => {
    children.push(
      new Paragraph({
        text: `• ${item}`,
        spacing: { after: 100 },
        bullet: {
          level: 0
        }
      })
    )
  })

  children.push(
    new Paragraph({
      text: '',
      spacing: { after: 200 }
    })
  )

  // Test Strategy
  children.push(
    new Paragraph({
      text: 'Test Strategy',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  )

  testPlan.testStrategy.forEach(strategy => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${strategy.type}: `,
            bold: true
          }),
          new TextRun({
            text: strategy.description
          })
        ],
        spacing: { after: 150 }
      })
    )
  })

  children.push(
    new Paragraph({
      text: '',
      spacing: { after: 200 }
    })
  )

  // Test Items
  children.push(
    new Paragraph({
      text: 'Test Items',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  )

  testPlan.testItems.forEach(item => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.id}: `,
            bold: true
          }),
          new TextRun({
            text: item.name
          })
        ],
        spacing: { after: 100 }
      })
    )
    if (item.description && item.description !== item.name) {
      children.push(
        new Paragraph({
          text: `  ${item.description}`,
          spacing: { after: 100 },
          indent: {
            left: 400
          }
        })
      )
    }
  })

  children.push(
    new Paragraph({
      text: '',
      spacing: { after: 200 }
    })
  )

  // Resources
  children.push(
    new Paragraph({
      text: 'Resources',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  )

  testPlan.resources.forEach(resource => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${resource.role}: `,
            bold: true
          }),
          new TextRun({
            text: resource.responsibility
          })
        ],
        spacing: { after: 100 }
      })
    )
  })

  children.push(
    new Paragraph({
      text: '',
      spacing: { after: 200 }
    })
  )

  // Schedule
  children.push(
    new Paragraph({
      text: 'Schedule',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  )

  testPlan.schedule.phases.forEach(phase => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${phase.phase} `,
            bold: true
          }),
          new TextRun({
            text: `(${phase.duration})`
          })
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    )

    phase.activities.forEach(activity => {
      children.push(
        new Paragraph({
          text: `• ${activity}`,
          spacing: { after: 100 },
          bullet: {
            level: 0
          }
        })
      )
    })

    children.push(
      new Paragraph({
        text: '',
        spacing: { after: 100 }
      })
    )
  })

  // Risks
  children.push(
    new Paragraph({
      text: 'Risks and Mitigation',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 }
    })
  )

  testPlan.risks.forEach(risk => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: risk.risk,
            bold: true
          })
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Impact: ',
            bold: true
          }),
          new TextRun({
            text: risk.impact
          })
        ],
        spacing: { after: 100 }
      })
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Mitigation: ',
            bold: true
          }),
          new TextRun({
            text: risk.mitigation
          })
        ],
        spacing: { after: 150 }
      })
    )
  })

  // Recommendations
  if (testPlan.recommendations && testPlan.recommendations.length > 0) {
    children.push(
      new Paragraph({
        text: '',
        spacing: { after: 200 }
      })
    )

    children.push(
      new Paragraph({
        text: 'Recommendations',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    )

    testPlan.recommendations.forEach((rec, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. `,
              bold: true
            }),
            new TextRun({
              text: `${rec.type}: ${rec.message}`
            })
          ],
          spacing: { after: 100 }
        })
      )
    })
  }

  // Analysis Summary
  if (testPlan.analysis) {
    children.push(
      new Paragraph({
        text: '',
        spacing: { after: 200 }
      })
    )

    children.push(
      new Paragraph({
        text: 'Analysis Summary',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Complexity: ',
            bold: true
          }),
          new TextRun({
            text: testPlan.analysis.complexity
          })
        ],
        spacing: { after: 100 }
      })
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Estimated Test Cases: ',
            bold: true
          }),
          new TextRun({
            text: testPlan.analysis.estimatedTestCases.toString()
          })
        ],
        spacing: { after: 100 }
      })
    )

    if (
      testPlan.analysis.detectedFunctionalities &&
      testPlan.analysis.detectedFunctionalities.length > 0
    ) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Detected Functionalities: ',
              bold: true
            }),
            new TextRun({
              text: testPlan.analysis.detectedFunctionalities.join(', ')
            })
          ],
          spacing: { after: 100 }
        })
      )
    }
  }

  const doc = new Document({
    sections: [
      {
        children
      }
    ]
  })

  const blob = await Packer.toBlob(doc)
  return blob
}

/**
 * Export test plan to PDF format
 */
export function exportTestPlanToPDF(testPlan) {
  if (!testPlan) {
    return null
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  let yPosition = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  const lineHeight = 7

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace = lineHeight) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Helper function to add text with word wrap
  const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(color[0], color[1], color[2])

    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach(line => {
      checkPageBreak(lineHeight)
      doc.text(line, margin, yPosition)
      yPosition += lineHeight
    })
  }

  // Title
  addText(testPlan.title, 18, true, [0, 0, 0])
  yPosition += 5

  // Type
  addText(`Type: ${testPlan.type}`, 12, false, [100, 100, 100])
  yPosition += 10

  // Objectives
  checkPageBreak(lineHeight * 2)
  addText('Objectives', 14, true)
  yPosition += 3
  testPlan.objectives.forEach((objective, index) => {
    addText(`${index + 1}. ${objective}`, 11, false)
  })
  yPosition += 5

  // Scope
  checkPageBreak(lineHeight * 2)
  addText('Scope', 14, true)
  yPosition += 3

  addText('In Scope:', 12, true)
  yPosition += 2
  testPlan.scope.inScope.forEach(item => {
    addText(`• ${item}`, 11, false)
  })
  yPosition += 3

  addText('Out of Scope:', 12, true)
  yPosition += 2
  testPlan.scope.outOfScope.forEach(item => {
    addText(`• ${item}`, 11, false)
  })
  yPosition += 5

  // Test Strategy
  checkPageBreak(lineHeight * 2)
  addText('Test Strategy', 14, true)
  yPosition += 3
  testPlan.testStrategy.forEach(strategy => {
    addText(`${strategy.type}:`, 12, true)
    yPosition += 2
    addText(strategy.description, 11, false)
    yPosition += 3
  })
  yPosition += 2

  // Test Items
  checkPageBreak(lineHeight * 2)
  addText('Test Items', 14, true)
  yPosition += 3
  testPlan.testItems.forEach(item => {
    addText(`${item.id}: ${item.name}`, 11, true)
    if (item.description && item.description !== item.name) {
      yPosition += 2
      const descLines = doc.splitTextToSize(`  ${item.description}`, maxWidth - 10)
      descLines.forEach(line => {
        checkPageBreak(lineHeight)
        doc.setFontSize(10)
        doc.text(line, margin + 5, yPosition)
        yPosition += lineHeight
      })
      doc.setFontSize(11)
    }
    yPosition += 2
  })
  yPosition += 3

  // Resources
  checkPageBreak(lineHeight * 2)
  addText('Resources', 14, true)
  yPosition += 3
  testPlan.resources.forEach(resource => {
    addText(`${resource.role}:`, 12, true)
    yPosition += 2
    addText(`  ${resource.responsibility}`, 11, false)
    yPosition += 3
  })
  yPosition += 2

  // Schedule
  checkPageBreak(lineHeight * 2)
  addText('Schedule', 14, true)
  yPosition += 3
  testPlan.schedule.phases.forEach(phase => {
    addText(`${phase.phase} (${phase.duration})`, 12, true)
    yPosition += 2
    phase.activities.forEach(activity => {
      addText(`• ${activity}`, 11, false)
    })
    yPosition += 3
  })
  yPosition += 2

  // Risks
  checkPageBreak(lineHeight * 2)
  addText('Risks and Mitigation', 14, true)
  yPosition += 3
  testPlan.risks.forEach(risk => {
    addText(risk.risk, 12, true)
    yPosition += 2
    addText(`Impact: ${risk.impact}`, 11, false, [200, 0, 0])
    yPosition += 2
    addText(`Mitigation: ${risk.mitigation}`, 11, false)
    yPosition += 4
  })

  // Recommendations
  if (testPlan.recommendations && testPlan.recommendations.length > 0) {
    checkPageBreak(lineHeight * 2)
    addText('Recommendations', 14, true)
    yPosition += 3
    testPlan.recommendations.forEach((rec, index) => {
      addText(`${index + 1}. ${rec.type}: ${rec.message}`, 11, false)
    })
    yPosition += 5
  }

  // Analysis Summary
  if (testPlan.analysis) {
    checkPageBreak(lineHeight * 2)
    addText('Analysis Summary', 14, true)
    yPosition += 3
    addText(`Complexity: ${testPlan.analysis.complexity}`, 11, false)
    yPosition += 2
    addText(`Estimated Test Cases: ${testPlan.analysis.estimatedTestCases}`, 11, false)
    if (
      testPlan.analysis.detectedFunctionalities &&
      testPlan.analysis.detectedFunctionalities.length > 0
    ) {
      yPosition += 2
      addText(
        `Detected Functionalities: ${testPlan.analysis.detectedFunctionalities.join(', ')}`,
        11,
        false
      )
    }
  }

  return doc
}

/**
 * Download file helper
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
