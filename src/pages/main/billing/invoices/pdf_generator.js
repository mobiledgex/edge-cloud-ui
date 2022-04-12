/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { jsPDF } from "jspdf";
import { amountSummary, customerInfo, invoiceInfo, itemKeys, statusAmount, cutomizeData } from "./constant";

const addHeader = (doc, label, textPosition, linex, liney) => {
  doc.setFontSize(15);
  doc.setTextColor('#455A64')
  doc.line(linex, liney, linex + 80, liney)
  doc.text(label, linex, textPosition)
  doc.line(linex, liney + 11, linex + 80, liney + 11)
}

const addContent = (doc, x_position, y_position, i, key, data) => {
  doc.setTextColor('#455A64')
  doc.setFontSize(10);
  doc.text(key.label, x_position, y_position + (i * 7))
  let value = key.custom ? cutomizeData(key, data) : data[key.field]
  doc.text(value, x_position + 80, y_position + (i * 7), { align: 'right' })
}

const generateInvoice = (doc, y_pos, data) => {
  y_pos = y_pos + 11
  let x_position = 120
  invoiceInfo.forEach((key, i) => {
    key.header ?
      addHeader(doc, key.label, 17, 120, 10) :
      addContent(doc, x_position, y_pos, i, key, data)
  })
  return y_pos
}

const generateStatus = (doc, y_pos, data) => {
  doc.setDrawColor(76, 175, 80);
  doc.rect(120, 60, 80, 10)
  doc.setFontSize(13);
  doc.setFillColor(76, 175, 80);
  doc.setTextColor('#FFF');
  let f = 'OPEN'.length
  doc.rect(120.1, 60.1, 4 * f, 9.6, 'F');
  doc.text('OPEN', 121, 66.5, { align: 'left' })
  doc.setTextColor('#455A64')
  doc.text(statusAmount(data), 198, 66.5, { align: 'right' })
}

const generateCustomer = (doc, y_pos, data) => {
  let y_position = y_pos + 51
  let x_position = 10
  customerInfo.forEach((key, i) => {
    key.header ?
      addHeader(doc, key.label, 67, 10, 60) :
      addContent(doc, x_position, y_position, i, key, data)
  })

  if (y_position > y_pos) {
    y_pos = y_position
  }
  return y_pos
}

const resetHeight = (doc, y_pos) => {
  let height = doc.internal.pageSize.height
  if (y_pos > height) {
    doc.addPage()
    return true
  }
  return false
}

const generateTable = (doc, y_pos_curr, items) => {
  let count = 0
  let y_pos = y_pos_curr + 38
  //header
  let x_pos = 10
  itemKeys.forEach((key, i) => {
    if (key.visible) {
      count = count + 1
      if (i > 0) {
        x_pos = x_pos + 45
      }
      doc.setFontSize(13)
      doc.setTextColor('#455A64')
      doc.text(key.label, x_pos, y_pos)
      if (x_pos === 10) {
        x_pos = x_pos + 30
      }
    }
  })
  y_pos = y_pos + 3
  doc.line(10, y_pos, count * 50, y_pos)
  y_pos = y_pos + 7
  //body
  items.forEach((item, i) => {
    x_pos = 10
    if (resetHeight(doc, y_pos + 8 + 10)) {
      y_pos = 10
    }
    if (i > 0) {
      y_pos = y_pos + 8
    }
    itemKeys.forEach((key, j) => {
      if (j > 0) {
        x_pos = x_pos + 45
      }
      if (key.visible) {
        doc.setFontSize(11)
        doc.setTextColor('#455A64')
        let value = key.custom ? cutomizeData(key, item) : item[key.serverField]
        doc.text(value, x_pos, y_pos)
        if (key.sub) {
          doc.setFontSize(8)
          doc.setTextColor('#9E9E9E')
          doc.text(item[itemKeys[key.sub].serverField], x_pos, y_pos + 7)
        }
        if (x_pos === 10) {
          x_pos = x_pos + 30
        }
      }
    })
    y_pos = y_pos + 10
    doc.line(10, y_pos, count * 50, y_pos)
  })
  y_pos = y_pos + 10
  if (y_pos > y_pos_curr) {
    y_pos_curr = y_pos
  }
  return y_pos
}

const generateSummary = (doc, y_pos_current, data) => {
  let x_pos = 130
  let y_pos = y_pos_current + 5
  amountSummary.forEach(key => {
    doc.text(key.label, x_pos, y_pos)
    doc.text(`$${data[key.field]}`, x_pos + 45, y_pos)
    y_pos = y_pos + 4
    doc.line(x_pos, y_pos, x_pos + 70, y_pos)
    y_pos = y_pos + 7
  })

}

export const generatePDF = (data) => {
  const doc = new jsPDF();
  let y_pos = 10
  doc.setDrawColor(218, 220, 224);
  doc.addImage('assets/brand/mex_logo_dark.png', 'PNG', 10, 10, 78, 13)
  y_pos = generateInvoice(doc, y_pos, data)
  generateStatus(doc, y_pos, data)
  doc.setDrawColor(218, 220, 224);
  y_pos = generateCustomer(doc, y_pos, data['customer'])
  y_pos = generateTable(doc, y_pos, data['items'])
  generateSummary(doc, y_pos, data)
  window.open(doc.output('bloburl', { filename: 'invoice.pdf' }), '_blank');
  // doc.save("a4.pdf");
}