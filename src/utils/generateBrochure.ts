export interface LeadInfo {
  name: string;
  phone: string;
  email?: string;
  city?: string;
}

export async function downloadFranchiseBrochure(lead: LeadInfo) {
  const cleanName = lead.name ? lead.name.trim().replace(/\s+/g, '_') : 'Customer';
  const fileName = `Connect2Air_Drone_Brochure_${cleanName}.pdf`;

  const link = document.createElement('a');
  link.href = '/Connect2Air_Drone_Brochure.pdf';
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



