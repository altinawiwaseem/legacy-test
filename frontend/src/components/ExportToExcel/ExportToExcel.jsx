import React from "react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { AiOutlineDownload } from "react-icons/ai";

function ExportToExcel({ data }) {
  console.log(data);
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Cell styles
    const passCellStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" }, // Green background for Pass
      },
    };

    const failCellStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000" }, // Red background for Fail
      },
    };

    const headerRow1 = worksheet.addRow([
      "Tester",
      "",
      "Test Object",
      "Stable",
      "Build Number",
    ]);
    headerRow1.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFCC" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    //  first data row
    const dataRow1 = worksheet.addRow([
      data.username,
      "",
      data?.test_object,
      data?.stable,
      data?.build_number,
    ]);

    worksheet.addRow([]);

    const headerRow2 = worksheet.addRow([
      "Market Variant",
      "",
      "Screen Size",
      "Project",
      "Date",
    ]);
    headerRow2.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFCC" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    //  second data row
    const dataRow2 = worksheet.addRow([
      data?.market_variant,
      "",
      data?.screen_size,
      data?.project,
      new Date(data?.created_at).toLocaleString("de-DE").slice(0, 10),
    ]);

    worksheet.mergeCells("A1:B1");
    worksheet.mergeCells("A2:B2");
    worksheet.mergeCells("A4:B4");
    worksheet.mergeCells("A5:B5");
    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 20 },
      { width: 20 },
      { width: 30 },
      { width: 20 },
      { width: 30 },
    ];

    // spacing row
    const notesHeaderRowIndex = worksheet.lastRow.number + 2;
    worksheet.addRow([]);
    worksheet.addRow(["Notes"]);
    worksheet.mergeCells(`A${notesHeaderRowIndex}:E${notesHeaderRowIndex}`);
    worksheet.getCell(`A${notesHeaderRowIndex}`).font = { bold: true };
    worksheet.getCell(`A${notesHeaderRowIndex}`).alignment = {
      horizontal: "center",
    };

    const notesArray = data.notes.split("\n");

    notesArray.forEach((note, index) => {
      const noteRowIndex = worksheet.lastRow.number + 1;
      worksheet.addRow([index + 1, note]);
      worksheet.mergeCells(`B${noteRowIndex}:E${noteRowIndex}`);
      const notesHeaderCell = worksheet.getCell(`A${notesHeaderRowIndex}`);
      notesHeaderCell.font = { bold: true };
      notesHeaderCell.alignment = { horizontal: "center" };
      notesHeaderCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFCC" },
      };
    });

    const stepsHeaders = [
      "No.",
      "Step Details",
      "Expected Results",
      "Actual Result",
      "Result",
    ];

    // spacing row
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow(stepsHeaders).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFCC" },
      };
    });

    // Apply borders to the steps header row
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Adjust column widths
    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
      { width: 30 },
    ];

    // step data with styling
    data.steps.forEach((step) => {
      const row = worksheet.addRow([
        step.step_id,
        step.step_details,
        step.expected_results,
        step.actual_result,
        step.result,
      ]);

      // Styling based on the result
      if (step.result === "Pass") {
        row.getCell(5).fill = passCellStyle.fill;
      } else if (step.result === "Fail") {
        row.getCell(5).fill = failCellStyle.fill;
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generate the Excel file
    const blob = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${data.build_number}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <button
      className="icon"
      style={{ color: "blue" }}
      onClick={() => generateExcel(data)}
    >
      <AiOutlineDownload />
    </button>
  );
}

export default ExportToExcel;
