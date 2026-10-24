import { generateReportTemplate } from './report.template';

describe('generateReportTemplate', () => {
  it('should generate valid HTML containing the report details', () => {
    const dto = {
      address: 'Calle 10 #123, Sector Centro',
      description: 'Tubería rota en acera',
      severity: 'high',
      reporterPhone: '809-555-1234',
    };

    const html = generateReportTemplate(
      dto,
      'https://example.com/reports/photo.png',
    );

    expect(html).toContain('Calle 10 #123, Sector Centro');
    expect(html).toContain('Tubería rota en acera');
    expect(html).toContain('809-555-1234');
    expect(html).toContain('Alta');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<img src="https://example.com/reports/photo.png"');
    expect(html).toContain('Nuevo reporte ciudadano de fuga - AguaFix');
  });

  it('should handle medium and low severity correctly', () => {
    const lowDto = {
      address: 'Parque Central',
      description: 'Goteo en hidrante',
      severity: 'low',
      reporterPhone: '809-555-9876',
    };

    const html = generateReportTemplate(
      lowDto,
      'https://example.com/reports/photo.png',
    );
    expect(html).toContain('Baja');
  });
});
