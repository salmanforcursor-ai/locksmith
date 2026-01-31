/**
 * Data Import Script for LocksmithNow
 * 
 * This script processes the JSON data file and prepares it for Supabase import.
 * Run with: npx tsx scripts/import-data.ts
 * 
 * Note: This script geocodes addresses using OpenStreetMap Nominatim API
 * Rate limit: 1 request per second, so ~300 addresses = ~5 minutes
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawLocksmith {
    business_name: string;
    business_name_citation?: string;
    full_address: string;
    full_address_citation?: string;
    phone_number: string;
    phone_number_citation?: string;
    source_url: string;
    source_url_citation?: string;
    official_website?: string;
    official_website_citation?: string;
    yellowpages_ca?: {
        url: string;
        url_citation?: string;
    };
}

interface ProcessedLocksmith {
    business_name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    website: string | null;
    source_url: string;
    yellowpages_url: string | null;
    lat: number | null;
    lng: number | null;
}

// Geocoding function
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (address.toLowerCase().includes('not available')) {
        return null;
    }
    
    const searchAddress = address.includes('Canada') ? address : `${address}, Canada`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&countrycodes=ca&limit=1`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'LocksmithNow/1.0 (https://locksmithnow.ca)',
            },
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        
        if (data.length === 0) return null;
        
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Parse address
function parseAddress(fullAddress: string): { street: string; city: string; province: string; postalCode: string } {
    if (fullAddress.toLowerCase().includes('not available')) {
        return { street: '', city: '', province: '', postalCode: '' };
    }
    
    const parts = fullAddress.split(',').map(p => p.trim());
    
    if (parts.length >= 2) {
        const street = parts[0];
        const cityProvince = parts.slice(1).join(', ');
        
        const provinceMatch = cityProvince.match(/\b(ON|BC|AB|SK|MB|QC|NB|NS|PE|NL|YT|NT|NU)\b/i);
        const province = provinceMatch ? provinceMatch[1].toUpperCase() : '';
        
        const postalMatch = cityProvince.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i);
        const postalCode = postalMatch ? postalMatch[0].toUpperCase() : '';
        
        let city = parts.length >= 2 ? parts[1] : '';
        city = city.replace(/\s*(ON|BC|AB|SK|MB|QC|NB|NS|PE|NL|YT|NT|NU)\s*/gi, '').trim();
        city = city.replace(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i, '').trim();
        
        return { street, city, province, postalCode };
    }
    
    return { street: fullAddress, city: '', province: '', postalCode: '' };
}

// Format phone
function formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    const normalized = digits.startsWith('1') && digits.length === 11 ? digits.slice(1) : digits;
    
    if (normalized.length === 10) {
        return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6)}`;
    }
    return phone;
}

// Sleep for rate limiting
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('📂 Loading JSON data...');
    
    const jsonPath = path.join(process.cwd(), 'extract-data-2026-01-30.json');
    
    if (!fs.existsSync(jsonPath)) {
        console.error('❌ JSON file not found:', jsonPath);
        process.exit(1);
    }
    
    const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const locksmiths: RawLocksmith[] = rawData.locksmiths || [];
    
    console.log(`📊 Found ${locksmiths.length} locksmiths to process`);
    
    const processed: ProcessedLocksmith[] = [];
    let geocoded = 0;
    let failed = 0;
    
    for (let i = 0; i < locksmiths.length; i++) {
        const raw = locksmiths[i];
        const parsed = parseAddress(raw.full_address);
        
        console.log(`[${i + 1}/${locksmiths.length}] Processing: ${raw.business_name}`);
        
        // Geocode (with rate limiting)
        let coords: { lat: number; lng: number } | null = null;
        
        if (raw.full_address && !raw.full_address.toLowerCase().includes('not available')) {
            coords = await geocodeAddress(raw.full_address);
            
            if (coords) {
                geocoded++;
                console.log(`  ✅ Geocoded: ${coords.lat}, ${coords.lng}`);
            } else {
                failed++;
                console.log(`  ⚠️ Could not geocode address`);
            }
            
            // Rate limit: 1 request per second
            await sleep(1100);
        } else {
            failed++;
            console.log(`  ⚠️ Address not available`);
        }
        
        processed.push({
            business_name: raw.business_name,
            phone: formatPhone(raw.phone_number),
            address: parsed.street,
            city: parsed.city,
            province: parsed.province,
            postal_code: parsed.postalCode,
            website: raw.official_website || null,
            source_url: raw.source_url,
            yellowpages_url: raw.yellowpages_ca?.url || null,
            lat: coords?.lat || null,
            lng: coords?.lng || null,
        });
    }
    
    console.log('\n📊 Summary:');
    console.log(`  Total: ${locksmiths.length}`);
    console.log(`  Geocoded: ${geocoded}`);
    console.log(`  Failed: ${failed}`);
    
    // Generate SQL
    console.log('\n📝 Generating SQL insert statements...');
    
    let sql = `-- Auto-generated SQL for LocksmithNow data import
-- Generated: ${new Date().toISOString()}
-- Total records: ${processed.length}

`;
    
    for (const l of processed) {
        if (!l.lat || !l.lng) continue; // Skip entries without coordinates
        
        const escapeSql = (str: string | null) => str ? str.replace(/'/g, "''") : null;
        
        sql += `INSERT INTO locksmiths (
    business_name, phone, address, city, province, postal_code,
    website, source_url, yellowpages_url, location,
    availability_status, is_verified, featured_tier
) VALUES (
    '${escapeSql(l.business_name)}',
    '${escapeSql(l.phone)}',
    '${escapeSql(l.address)}',
    '${escapeSql(l.city)}',
    '${escapeSql(l.province)}',
    '${escapeSql(l.postal_code)}',
    ${l.website ? `'${escapeSql(l.website)}'` : 'NULL'},
    '${escapeSql(l.source_url)}',
    ${l.yellowpages_url ? `'${escapeSql(l.yellowpages_url)}'` : 'NULL'},
    ST_SetSRID(ST_MakePoint(${l.lng}, ${l.lat}), 4326)::geography,
    'offline',
    FALSE,
    'standard'
);\n\n`;
    }
    
    // Write SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'import-locksmiths.sql');
    fs.mkdirSync(path.dirname(sqlPath), { recursive: true });
    fs.writeFileSync(sqlPath, sql);
    
    console.log(`✅ SQL file written to: ${sqlPath}`);
    
    // Also write JSON for reference
    const jsonOutPath = path.join(process.cwd(), 'scripts', 'processed-locksmiths.json');
    fs.writeFileSync(jsonOutPath, JSON.stringify(processed, null, 2));
    
    console.log(`✅ JSON file written to: ${jsonOutPath}`);
    console.log('\n🎉 Done! Run the SQL file in Supabase SQL Editor to import data.');
}

main().catch(console.error);
