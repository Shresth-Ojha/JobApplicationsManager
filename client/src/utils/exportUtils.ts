import type { Application } from '@/types/application';

export function exportToCSV(applications: Application[], filename = 'applications.csv') {
    const headers = [
        'Company',
        'Position',
        'Status',
        'Priority',
        'Location',
        'Application Date',
        'Job URL',
        'Notes'
    ];

    const rows = applications.map(app => [
        app.companyName,
        app.positionTitle,
        app.status.replace(/_/g, ' '),
        app.priority,
        app.locationCity || '',
        new Date(app.applicationDate).toLocaleDateString(),
        app.jobUrl || '',
        (app.notes || '').replace(/"/g, '""') // Escape quotes for CSV
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function exportToPDF(applications: Application[]) {
    // Create a printable HTML document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups to export PDF');
        return;
    }

    const tableRows = applications.map(app => `
        <tr>
            <td>${app.companyName}</td>
            <td>${app.positionTitle}</td>
            <td>${app.status.replace(/_/g, ' ')}</td>
            <td>${app.priority}</td>
            <td>${app.locationCity || '-'}</td>
            <td>${new Date(app.applicationDate).toLocaleDateString()}</td>
        </tr>
    `).join('');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Job Applications</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #1e40af; margin-bottom: 5px; }
                .subtitle { color: #6b7280; font-size: 12px; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #3b82f6; color: white; padding: 10px; text-align: left; }
                td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
                tr:nth-child(even) { background: #f9fafb; }
                @media print {
                    body { padding: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Job Applications</h1>
            <div class="subtitle">Exported on ${new Date().toLocaleDateString()} • ${applications.length} applications</div>
            <table>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Location</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
}

