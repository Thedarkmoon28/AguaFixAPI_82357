export interface ReportTemplateDto {
  address: string;
  description: string;
  severity: string;
  reporterPhone: string;
}

export function generateReportTemplate(
  dto: ReportTemplateDto,
  photoUrl: string,
): string {
  const escape = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[c]!,
    );
  dto = {
    address: escape(dto.address),
    description: escape(dto.description),
    severity: escape(dto.severity),
    reporterPhone: escape(dto.reporterPhone),
  };
  const safePhotoUrl = escape(photoUrl);
  const severityMap: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };

  const severityText = severityMap[dto.severity.toLowerCase()] || dto.severity;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Fuga de Agua</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">
    <tr>
      <td style="padding: 16px; background-color: #0d6efd; color: #fff;">
        <h2 style="margin: 0; font-size: 18px;">Nuevo reporte ciudadano de fuga - AguaFix</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;">
            <td width="30%" style="font-weight: bold; color: #555;">Dirección:</td>
            <td>${dto.address}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="font-weight: bold; color: #555;">Descripción:</td>
            <td>${dto.description}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="font-weight: bold; color: #555;">Severidad:</td>
            <td>${severityText}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #555;">Teléfono de contacto:</td>
            <td>${dto.reporterPhone}</td>
          </tr>
        </table>
        <img src="${safePhotoUrl}" alt="Foto de la fuga" style="max-width: 100%; height: auto; margin-top: 16px;">
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
