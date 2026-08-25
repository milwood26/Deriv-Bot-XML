# Flex Property Solutions Limited - Website

## Project Overview
Professional property services website with integrated CRM backend for Flex Property Solutions Limited.

**Tagline:** "Reliable Service. Quality Work. Peace of Mind."

**Coverage:** All of United Kingdom

**Contact:**
- Email: flexpropertysolutions@gmail.com
- Phone (Mobile): 07849 183139
- Phone (Landline): 01689 616008

## Website Structure

### Pages Created
1. **Homepage** (`index.html`)
   - Hero section with CTAs
   - Trust badges (Google 5-star, Checkatrade, Fully Insured)
   - Services overview (6 services)
   - Why Choose Us section
   - Testimonials
   - Lead capture form

2. **Service Landing Pages** (`pages/services/`)
   - Fire Alarm Installation & Maintenance
   - Emergency Lighting Installation & Maintenance
   - Testing & Certification
   - Bathroom Fitting Design & Installation
   - Plumbing Services
   - Property Maintenance

3. **Additional Pages** (to be completed)
   - About Us
   - Contact
   - Testimonials
   - Emergency Services
   - Privacy Policy
   - Terms & Conditions

4. **CRM Admin Panel** (`admin/`)
   - Dashboard
   - Lead Management
   - Customer Database
   - Reports & Analytics

## Features

### Frontend
- ✅ Responsive design (mobile-first)
- ✅ SSL ready (HTTPS)
- ✅ WCAG 2.1 accessibility compliant
- ✅ Cross-browser compatible
- ✅ Click-to-call functionality
- ✅ Fast loading speed optimized
- ✅ Schema markup for SEO
- ✅ Google Analytics ready
- ✅ Facebook Pixel ready

### CRM Backend
- ✅ Lead capture from all forms
- ✅ Lead source tracking (UTM parameters)
- ✅ Lead status pipeline
- ✅ Customer database
- ✅ Email notifications
- ✅ GDPR compliance
- ✅ Exportable reports

### Trust Signals
- Google 5-Star Rated
- Checkatrade Proud Member
- Fully Insured & Approved
- Public Liability Insurance

## File Structure

```
flex-website/
├── index.html                 # Homepage
├── css/
│   ├── style.css             # Main stylesheet
│   └── service-pages.css     # Service page styles
├── js/
│   ├── main.js               # Main JavaScript
│   └── forms.js              # Form handling & CRM integration
├── images/                   # Image assets
├── pages/
│   ├── services/
│   │   ├── fire-alarm.html
│   │   ├── emergency-lighting.html
│   │   ├── testing-certification.html
│   │   ├── bathroom-fitting.html
│   │   ├── plumbing.html
│   │   └── property-maintenance.html
│   ├── about.html
│   ├── contact.html
│   ├── testimonials.html
│   ├── emergency.html
│   ├── privacy-policy.html
│   └── terms.html
└── admin/
    ├── index.html            # Admin login
    ├── dashboard.html        # CRM dashboard
    ├── leads.html            # Lead management
    ├── customers.html        # Customer database
    └── api/
        └── leads.php         # Lead submission API
```

## Deployment Instructions

### Testing Environment
Base URL: `https://howjamaica.com/flex`

### Steps
1. Upload all files to `/public_html/flex/` directory
2. Ensure `.htaccess` is configured for clean URLs
3. Set up SSL certificate
4. Configure email SMTP settings in `admin/api/config.php`
5. Set up database for CRM (MySQL/MariaDB)
6. Update database credentials in config file
7. Test all forms and CRM integration
8. Submit sitemap to Google Search Console
9. Set up Google Analytics 4
10. Configure Google Tag Manager

### Database Setup
```sql
CREATE DATABASE flex_crm;
USE flex_crm;

-- Create leads table
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service VARCHAR(100),
    message TEXT,
    lead_source VARCHAR(50),
    status ENUM('new', 'contacted', 'quote_sent', 'follow_up', 'converted', 'lost') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    service_type VARCHAR(100),
    status VARCHAR(50),
    quote_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    scheduled_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

## SEO Keywords

### Primary Keywords
- property services UK
- fire alarm installation UK
- emergency lighting UK
- bathroom fitting UK
- plumbing services UK
- property maintenance UK

### Location Keywords
- London property services
- Manchester property maintenance
- Birmingham fire alarms
- [Add major UK cities]

## Support & Maintenance

### Regular Tasks
- Weekly: Check form submissions and CRM sync
- Monthly: Review analytics and update content
- Quarterly: Security updates and backups
- Annually: Content refresh and SEO audit

### Contact for Support
- Technical issues: Check server logs
- Content updates: Edit HTML files directly
- CRM issues: Check database connection

## License
© 2024 Flex Property Solutions Limited. All rights reserved.
