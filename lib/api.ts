import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

export interface DrugInfo {
  rxcui: string;
  name: string;
  synonym: string;
  strength?: string;
  form?: string;
  route?: string;
}

export async function searchDrugs(query: string): Promise<DrugInfo[]> {
  try {
    const response = await axios.get(`${BASE_URL}/drugs.xml`, {
      params: { name: query },
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    const result = parser.parse(response.data);
    const drugGroup = result.rxnormdata?.drugGroup;

    if (!drugGroup || !drugGroup.conceptGroup) {
      console.warn('No drug data found');
      return [];
    }

    const drugs: DrugInfo[] = [];

    // Loop through concept groups
    drugGroup.conceptGroup.forEach((group: any) => {
      if (!group.conceptProperties) return; // ✅ Prevents "undefined" error

      const properties = Array.isArray(group.conceptProperties)
        ? group.conceptProperties
        : [group.conceptProperties];

      properties.forEach((prop: any) => {
        const drug: DrugInfo = {
          rxcui: prop.rxcui || 'Unknown',
          name: prop.name || 'Unknown',
          synonym: prop.synonym || prop.name || 'Unknown',
        };

        // Extract strength, form, and route from the name
        const nameParts = drug.name.split(' ');
        drug.strength = nameParts.find(part => /\d+\s*(MG|MCG|ML)/i.test(part));
        drug.form = nameParts.find(part => 
          /(tablet|capsule|solution|suspension|injection|cream|ointment|gel)/i.test(part)
        );
        drug.route = nameParts.find(part => 
          /(oral|topical|intravenous|intramuscular|subcutaneous)/i.test(part)
        );

        drugs.push(drug);
      });
    });

    return drugs;
  } catch (error) {
    console.error('❌ Error searching drugs:', error);
    throw new Error('Failed to fetch drug data');
  }
}
