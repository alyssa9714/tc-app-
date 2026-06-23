import { useState } from "react";

const AGENTS = ["Darson", "Amanda", "Eric", "Donny", "Russ", "Michelle", "Dirk", "Tiff", "Isaac", "Jon"];

const STATUSES = ["Coming Soon", "Preparing for Market", "Active", "Under Contract", "Closed", "Withdrawn/Cancelled", "Expired/Cancelled", "Off Market"];

const STATUS_COLORS = {
  "Coming Soon": { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
  "Preparing for Market": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "Active": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "Under Contract": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Closed": { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1" },
  "Withdrawn/Cancelled": { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  "Expired/Cancelled": { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  "Off Market": { bg: "#FAFAFA", text: "#737373", border: "#E5E5E5" },
};

const CHECKLIST_ITEMS = [
  { key: "agent_confirmed", label: "Agent Confirmed & Opportunity Created" },
  { key: "listing_docs", label: "Listing Docs Prepared" },
  { key: "listing_docs_compliance", label: "Listing Docs Sent to Compliance" },
  { key: "abstract", label: "Abstract Located" },
  { key: "photos_ordered", label: "Photos Ordered" },
  { key: "matterport_ordered", label: "Matterport Ordered" },
  { key: "staging_needed", label: "Staging Needed" },
  { key: "staging_completed", label: "Staging Completed" },
  { key: "mls_draft", label: "MLS Draft Completed" },
  { key: "mls_approved", label: "MLS Draft Approved by Agent" },
  { key: "disclosures", label: "Disclosures Added to Listing" },
  { key: "published", label: "Published / Live on Market" },
  { key: "showing_time", label: "ShowingTime Set Up" },
  { key: "supplement_docs", label: "Supplement Docs Uploaded" },
  { key: "email_owner", label: "Email Sent to Owner (CC Agent)" },
  { key: "tgg_spreadsheet", label: "TGG Production Spreadsheet Updated" },
  { key: "compliance_added", label: "Added to Compliance" },
  { key: "file_compliant", label: "File Compliant" },
];

const PIPELINE_ORDER = ["Coming Soon", "Preparing for Market", "Active"];

const TABS = [
  { key: "listings", label: "📋 Listings" },
  { key: "pipeline", label: "🔄 Pipeline" },
  { key: "updates", label: "📬 Seller Updates" },
  { key: "deadlines", label: "⏰ Deadlines" },
  { key: "mls", label: "📝 MLS Notes" },
  { key: "rules", label: "📌 Rules & Reminders" },
];

const RULES = [
  {
    category: "ShowingTime",
    icon: "🗓",
    color: "#1D4ED8",
    colorlt: "#EFF6FF",
    rules: [
      'Always tick "Confirm Appointments" in ShowingTime so agents get notified.',
    ]
  },
  {
    category: "Supra Box & Door Code",
    icon: "🔑",
    color: "#D97706",
    colorlt: "#FFFBEB",
    rules: [
      "DO NOT post the Supra box number anywhere. Only include lockbox codes if the property does NOT have a supra.",
      "DO NOT order photos or matterport if the Supra box # or door code is not in the spreadsheet.",
      "DO NOT go live or ask the agent for review if Supra/door code info is missing from the sheet.",
      "Supra box # and door code MUST be included in the Agent's Remarks.",
    ]
  },
  {
    category: "Photos & Matterport",
    icon: "📷",
    color: "#7C3AED",
    colorlt: "#F5F3FF",
    rules: [
      "Once photos and matterport are scheduled, send a Calendar invite to the agent.",
      "Send an email to the seller informing them of the scheduled dates. Ask if they are in possession of the abstract.",
    ]
  },
  {
    category: "Public Remarks",
    icon: "✍️",
    color: "#15803D",
    colorlt: "#F0FDF4",
    rules: [
      "NO em dashes in public remarks.",
      "DO NOT include the property address in the public remarks.",
    ]
  },
  {
    category: "Agent Remarks Template (Upcoming Listings)",
    icon: "📝",
    color: "#0F766E",
    colorlt: "#F0FDFA",
    rules: [
      "EM to be held by Hubbard",
      "Reach out to co-list agent for questions/offers",
      "Supra box or door lock code",
    ]
  },
  {
    category: "Short Sale",
    icon: "🏦",
    color: "#BE123C",
    colorlt: "#FFF1F2",
    rules: [
      'If a listing falls under short sale, add in the agent remarks: "Sale is contingent upon offer approved from bank for short sales - allow 60 days for closing"',
    ]
  },
  {
    category: "Document Amendments — When to Get Initials",
    icon: "📄",
    color: "#1E293B",
    colorlt: "#F8FAFC",
    rules: [
      "✅ DO need initials when: changing price, changing dates, editing terms in a purchase agreement, anything that changes what the parties agreed to.",
      "❌ DO NOT need initials when: updating basic info on the listing data form, changes that do NOT affect actual contract terms (e.g. typing/fixing names, agent name, brokerage name, license number, other admin details, anything except price or go live date).",
    ]
  },
];

function blankChecklist(overrides = {}) {
  return Object.fromEntries(CHECKLIST_ITEMS.map(i => [i.key, overrides[i.key] || false]));
}

function makeListing(id, address, seller, agent, status, supra, door_code, notes, checklist_overrides = {}) {
  return {
    id, address, seller, seller_phone: "", seller_email: "",
    agent, status, type: "RES", listing_price: "", listing_date: "",
    supra: supra || "", door_code: door_code || "",
    days_on_market: 0, showing_count: 0,
    photo_datetime: "", matterport_date: "", staging_bid: "",
    notes: notes || "",
    checklist: blankChecklist(checklist_overrides),
    seller_updates: [], deadlines: [], mls_notes: "", remarks_draft: "",
  };
}

const SAMPLE_DATA = [
  // COMING SOON
  makeListing(1, "400 Head St, Churdan Iowa 50050", "", "Dirk", "Coming Soon", "", "0156", "Dirk is going to this appointment"),
  makeListing(2, "6 Plex and 3 Plex", "Becky", "Darson", "Coming Soon", "", "", "Might not be ready"),
  makeListing(3, "42nd (Waterbury)", "Chad & Krissy - SAMKCAD", "Darson", "Coming Soon", "", "", "42nd st 400K plus (not Invest DSM)"),
  makeListing(4, "1327 NE 51st Ave", "Kyle Robinson", "Darson", "Coming Soon", "", "", "Kyer & Kyle (brick duplex saylorville area)"),

  // PREPARING FOR MARKET
  makeListing(5, "1328 7th St", "Tony and Kristen Gansen", "Darson", "Preparing for Market", "", "0156", "Security system alarm code: 1328. Photos added to MLS, docs for agent review", { agent_confirmed:true, listing_docs:true, photos_ordered:true }),
  makeListing(6, "2814 48th Place", "Jessica and Jason Deitrick", "Donny", "Preparing for Market", "33501700", "", "Docs not yet prepared. Needs to locate abstract", { agent_confirmed:true, photos_ordered:true, matterport_ordered:true }),
  makeListing(7, "3905 Cambridge St", "Bhajan Aulakh & Manjeet Aulakh", "Russ", "Preparing for Market", "", "", "Waiting for photos", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true }),
  makeListing(8, "1405 E 37th Street", "Scott Groh", "Darson", "Preparing for Market", "", "0316", "Staging at 6/22, photos and MP scheduled on 6/23", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, staging_needed:true, mls_draft:true }),
  makeListing(9, "3903 Oakshire", "Johnathan", "Darson", "Preparing for Market", "", "2021", "3 month contract. Follow up on SD 6/19", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, mls_draft:true }),

  // ACTIVE
  makeListing(10, "1704 Main St, Hamburg", "Tudie Wheeler by Michael Beardsley as AIF", "Darson", "Active", "", "", "Follow up on SD 6/19", { agent_confirmed:true, listing_docs:true, photos_ordered:true, mls_draft:true, mls_approved:true, published:true, showing_time:true }),
  makeListing(11, "2121 Maple, Des Moines", "Chad & Krissy - SAMKCAD", "Darson", "Active", "", "9686", "Staging bid approved waiting on staging", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, staging_needed:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true, compliance_added:true }),
  makeListing(12, "181 40th Ave, Runnells", "Kent Braaksma", "Darson", "Active", "", "0156", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, abstract:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(13, "3413 2nd Ave, Des Moines", "Lind", "Donny", "Active", "31460474", "", "", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(14, "6806 SW 15th St, Des Moines", "Travis Morrison", "Darson", "Active", "", "0156", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(15, "1078 35th St, Des Moines", "Chad & Krissy - SELL MY HOUSE DSM LLC", "Darson", "Active", "", "1236", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(16, "406 W State Street, Jefferson", "Cory & Ashley Wingerson", "Russ", "Active", "", "0156", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(17, "4 Plex, 2915 Cottage Grove Avenue", "Cole and Collin", "Eric", "Active", "", "0156", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(18, "218 16th St N, Chariton Iowa", "Sean King", "Darson", "Active", "", "0156", "Matterport needs ordered", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(19, "4518 84th St", "Mindy Ohnemus", "Donny", "Active", "31432302", "", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(20, "3104 Giles St", "Jake and Lisa Thomas", "Michelle", "Active", "33238018", "", "Price drop completed 275K", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(21, "1440 21st Street", "Isaiah Phillips", "Darson", "Active", "", "316", "Price change completed", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(22, "1416 Osceola Avenue, Chariton", "Linda Cowen", "Eric", "Active", "", "0156", "Compliance needs reviewed", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(23, "1332 Braden Avenue, Chariton", "Linda Cowen", "Eric", "Active", "", "0156", "Compliance needs reviewed", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(24, "1309 Ashland Ave, Chariton", "Travis Bryan", "Eric", "Active", "", "No key", "Compliance needs reviewed", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(25, "812 Euclid Avenue", "Becky Hui", "Darson", "Active", "", "2358", "Price drop completed $160,000. Staging approved", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, staging_needed:true, staging_completed:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(26, "1917 59th Street", "Husidic", "Eric", "Active", "34279205", "", "Price drop done 209,000", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(27, "1946 Franklin Avenue", "Edward Printz", "Darson", "Active", "", "1908", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(28, "309 SE 4th Street", "Doug Holiday", "Darson", "Active", "", "2421", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(29, "702 Polk Blvd", "Gonzalez", "Darson", "Active", "NA", "3376", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(30, "1602 Wilson Ave", "HOME IMPROVEMENT & MAINTENANCE LLC", "Donny", "Active", "31458661", "", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(31, "658 18th St", "Rick", "Eric", "Active", "", "0156", "Missing SD, sent price drop addendum. Matterport needs ordered", { agent_confirmed:true, listing_docs:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(32, "227 Clark St, Des Moines", "Brandy Sampley", "Darson", "Active", "62091084", "", "Corrections needed. Matterport needs ordered", { agent_confirmed:true, listing_docs:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(33, "970 Roman Rd", "Terry & Christine Munson", "Darson", "Active", "31440073", "", "Staging approved, waiting on staging", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, staging_needed:true, staging_completed:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(34, "5415 Torgerson", "Anthony & Kimberly Schultz", "Eric", "Active", "", "4801", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(35, "6533 Sunset Ter", "Paul Moreland", "Michelle", "Active", "31435659", "", "Price changed from 310K to $289,900. Corrections needed", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(36, "1208 West St, Des Moines", "Ethan McCoy", "Darson", "Active", "", "", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(37, "809 Ashton Ave Lot B", "Kathleen Nickel", "Eric", "Active", "", "0316", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(38, "1540 33rd St", "Chad & Krissy - SAMKCAD", "Darson", "Active", "31440043", "", "Price changed to 135K. Staging waiting on bid", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, matterport_ordered:true, staging_needed:true, staging_completed:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(39, "1987 & 1989 SW 1st", "Dave & Eliot", "Darson", "Active", "", "1987-1968 or 2045 | 1979-1964", "Corrections needed", { agent_confirmed:true, listing_docs:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(40, "8479 Lakeshore", "Vowels", "Eric", "Active", "", "", "Go and show. Staging approved", { agent_confirmed:true, listing_docs:true, photos_ordered:true, matterport_ordered:true, staging_needed:true, staging_completed:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
  makeListing(41, "520 35th Street", "Adam", "Eric", "Active", "NA", "0156", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, published:true, showing_time:true }),
  makeListing(42, "1320 30th Street", "Brian Sigmon", "Darson", "Active", "NA", "", "", { agent_confirmed:true, listing_docs:true, listing_docs_compliance:true, photos_ordered:true, mls_draft:true, mls_approved:true, disclosures:true, published:true, showing_time:true }),
];

function newListing() {
  return {
    id: Date.now(), address: "", seller: "", seller_phone: "", seller_email: "",
    agent: "Darson", status: "Preparing for Market", type: "RES",
    listing_price: "", listing_date: "", supra: "", door_code: "",
    days_on_market: 0, showing_count: 0,
    photo_datetime: "", matterport_date: "", staging_bid: "", notes: "",
    checklist: blankChecklist(),
    seller_updates: [], deadlines: [], mls_notes: "", remarks_draft: "",
  };
}

function progress(checklist) {
  const total = CHECKLIST_ITEMS.length;
  const done = CHECKLIST_ITEMS.filter(i => checklist[i.key]).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

function today() { return new Date().toISOString().split("T")[0]; }

const C = {
  bg:"#F7F8FA", white:"#FFFFFF", navy:"#0F1F3D", navylt:"#1A3260",
  blue:"#1D4ED8", bluelt:"#EFF6FF", gold:"#D97706", goldlt:"#FFFBEB",
  border:"#E2E8F0", text:"#1E293B", muted:"#64748B",
  green:"#15803D", greenlt:"#F0FDF4", red:"#BE123C", redlt:"#FFF1F2",
  orange:"#C2410C",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${C.bg};font-family:'Inter',sans-serif;color:${C.text};min-height:100vh;font-size:14px}
  .app{display:flex;flex-direction:column;min-height:100vh}
  .topbar{background:${C.navy};padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between}
  .topbar-title{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:700;color:#fff}
  .topbar-sub{font-size:11px;color:#94A3B8;margin-top:1px}
  .nav{display:flex;gap:2px;background:${C.white};border-bottom:1px solid ${C.border};padding:0 24px;overflow-x:auto}
  .nav-tab{padding:12px 16px;font-size:13px;font-weight:500;color:${C.muted};cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;transition:all .15s}
  .nav-tab:hover{color:${C.navy}}
  .nav-tab.active{color:${C.blue};border-bottom-color:${C.blue};font-weight:600}
  .content{flex:1;padding:20px 24px}
  .stats{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
  .stat-card{background:${C.white};border:1px solid ${C.border};border-radius:10px;padding:12px 16px;min-width:100px;flex:1}
  .stat-num{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;color:${C.navy};line-height:1}
  .stat-label{font-size:11px;color:${C.muted};margin-top:3px;text-transform:uppercase;letter-spacing:.05em}
  .filters{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;align-items:center}
  .search-box{padding:7px 12px;border:1px solid ${C.border};border-radius:7px;background:${C.white};font-size:13px;color:${C.text};width:220px}
  .search-box:focus{outline:none;border-color:${C.blue}}
  .filter-select{padding:7px 10px;border:1px solid ${C.border};border-radius:7px;background:${C.white};font-size:13px;color:${C.text};cursor:pointer}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
  .card{background:${C.white};border:1px solid ${C.border};border-radius:10px;overflow:hidden;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .card:hover{box-shadow:0 4px 12px rgba(0,0,0,.08);transform:translateY(-1px)}
  .card-top{padding:14px 16px 10px}
  .card-address{font-weight:700;font-size:13.5px;color:${C.navy};margin-bottom:4px}
  .card-meta{font-size:12px;color:${C.muted};margin-bottom:6px}
  .card-bottom{padding:10px 16px 14px;border-top:1px solid ${C.border};background:#FAFBFC}
  .progress-bar{height:5px;background:#E2E8F0;border-radius:3px;overflow:hidden;margin-top:4px}
  .progress-fill{height:100%;border-radius:3px;transition:width .3s}
  .progress-label{font-size:11px;color:${C.muted};display:flex;justify-content:space-between}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid}
  .agent-tag{display:inline-block;padding:2px 8px;border-radius:5px;font-size:11px;font-weight:600;background:${C.bluelt};color:${C.blue}}
  .pipeline{display:flex;gap:14px;overflow-x:auto;padding-bottom:12px}
  .pipeline-col{min-width:260px;flex:1}
  .pipeline-header{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${C.muted};margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
  .pipeline-count{background:${C.border};color:${C.muted};border-radius:20px;padding:1px 8px;font-size:11px}
  .pipeline-card{background:${C.white};border:1px solid ${C.border};border-radius:8px;padding:11px 13px;margin-bottom:8px;cursor:pointer;transition:all .15s}
  .pipeline-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .pipeline-address{font-weight:600;font-size:13px;color:${C.navy};margin-bottom:2px}
  .pipeline-meta{font-size:11px;color:${C.muted}}
  .overlay{position:fixed;inset:0;background:rgba(15,31,61,.55);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto}
  .modal{background:${C.white};border-radius:14px;width:100%;max-width:780px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.25)}
  .modal-header{background:${C.navy};padding:16px 22px;display:flex;justify-content:space-between;align-items:center}
  .modal-title{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:700;color:#fff}
  .modal-sub{font-size:12px;color:#94A3B8;margin-top:2px}
  .modal-close{background:rgba(255,255,255,.15);border:none;color:#fff;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
  .modal-tabs{display:flex;background:#F8FAFC;border-bottom:1px solid ${C.border};overflow-x:auto}
  .modal-tab{padding:10px 14px;font-size:12px;font-weight:500;color:${C.muted};cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;transition:all .15s}
  .modal-tab.active{color:${C.blue};border-bottom-color:${C.blue};font-weight:600}
  .modal-body{padding:20px;max-height:62vh;overflow-y:auto}
  .modal-footer{padding:12px 20px;border-top:1px solid ${C.border};display:flex;justify-content:flex-end;gap:8px;background:#FAFBFC}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
  .form-group{display:flex;flex-direction:column;gap:4px}
  .form-group.full{grid-column:1/-1}
  .form-label{font-size:11px;font-weight:600;color:${C.muted};text-transform:uppercase;letter-spacing:.05em}
  .form-input{padding:8px 11px;border:1px solid ${C.border};border-radius:7px;font-size:13px;font-family:'Inter',sans-serif;color:${C.text};background:${C.bg};transition:border .15s}
  .form-input:focus{outline:none;border-color:${C.blue};background:${C.white}}
  .form-textarea{min-height:65px;resize:vertical}
  .form-select{padding:8px 11px;border:1px solid ${C.border};border-radius:7px;font-size:13px;font-family:'Inter',sans-serif;color:${C.text};background:${C.bg};cursor:pointer}
  .form-select:focus{outline:none;border-color:${C.blue}}
  .section-label{font-size:11px;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;margin-top:16px;padding-bottom:5px;border-bottom:1px solid ${C.border}}
  .checklist-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px}
  .check-item{display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 10px;border-radius:7px;border:1px solid ${C.border};background:${C.bg};transition:all .15s;user-select:none}
  .check-item:hover{border-color:${C.blue};background:${C.bluelt}}
  .check-item.checked{border-color:#BBF7D0;background:${C.greenlt}}
  .check-item input{width:14px;height:14px;cursor:pointer;accent-color:${C.green}}
  .check-item-label{font-size:12px;font-weight:500}
  .check-item.checked .check-item-label{color:${C.green}}
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:'Inter',sans-serif}
  .btn-primary{background:${C.blue};color:#fff}
  .btn-primary:hover{background:#1E40AF}
  .btn-secondary{background:${C.white};border:1px solid ${C.border};color:${C.navy}}
  .btn-secondary:hover{border-color:${C.blue};color:${C.blue}}
  .btn-danger{background:${C.redlt};color:${C.red};border:1px solid #FECDD3}
  .btn-gold{background:${C.gold};color:#fff}
  .btn-gold:hover{background:#B45309}
  .btn-sm{padding:5px 10px;font-size:12px}
  .update-item{background:${C.goldlt};border:1px solid #FDE68A;border-radius:8px;padding:10px 13px;margin-bottom:8px}
  .update-date{font-size:11px;font-weight:600;color:${C.gold};margin-bottom:3px}
  .update-note{font-size:13px;color:${C.text};line-height:1.5}
  .deadline-item{display:flex;align-items:center;gap:10px;padding:9px 13px;background:${C.white};border:1px solid ${C.border};border-radius:8px;margin-bottom:6px;cursor:pointer}
  .deadline-item.done{background:${C.greenlt};border-color:#BBF7D0}
  .deadline-item.overdue{background:${C.redlt};border-color:#FECDD3}
  .empty{text-align:center;padding:50px 20px;color:${C.muted}}
  .empty-icon{font-size:36px;margin-bottom:10px}
  .empty-text{font-size:14px;font-weight:600;color:${C.navy};margin-bottom:4px}
  .info-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
  .info-pill{background:${C.bg};border:1px solid ${C.border};border-radius:6px;padding:4px 10px;font-size:12px}
  .notes-box{background:${C.goldlt};border:1px solid #FDE68A;border-radius:8px;padding:11px 13px;font-size:13px;line-height:1.6;color:${C.text};white-space:pre-wrap;margin-bottom:12px}
`;

export default function App() {
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState(SAMPLE_DATA);
  const [agentFilter, setAgentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(null);
  const [modalTab, setModalTab] = useState("details");
  const [newUpdate, setNewUpdate] = useState("");
  const [newDeadline, setNewDeadline] = useState({ label: "", date: "" });

  const filtered = listings.filter(l => {
    const a = agentFilter === "All" || l.agent === agentFilter;
    const s = statusFilter === "All" || l.status === statusFilter;
    const q = !search || l.address.toLowerCase().includes(search.toLowerCase()) || (l.seller||"").toLowerCase().includes(search.toLowerCase());
    return a && s && q;
  });

  const stats = {
    total: listings.length,
    coming: listings.filter(l=>l.status==="Coming Soon").length,
    preparing: listings.filter(l=>l.status==="Preparing for Market").length,
    active: listings.filter(l=>l.status==="Active").length,
  };

  function openView(l) { setActive(l); setModalTab("details"); setModal("view"); }
  function openAdd() { setForm(newListing()); setModalTab("details"); setModal("edit"); }
  function openEdit(l) { setForm({...l, checklist:{...l.checklist}, seller_updates:[...l.seller_updates], deadlines:[...l.deadlines]}); setModalTab("details"); setModal("edit"); }

  function saveForm() {
    if (listings.find(l=>l.id===form.id)) {
      setListings(prev => prev.map(l => l.id===form.id ? form : l));
    } else {
      setListings(prev => [form, ...prev]);
    }
    setModal(null); setForm(null);
  }

  function updateListing(updated) {
    setListings(prev => prev.map(l => l.id===updated.id ? updated : l));
    setActive(updated);
  }

  function toggleCheck(listing, key) {
    updateListing({...listing, checklist:{...listing.checklist,[key]:!listing.checklist[key]}});
  }

  function addUpdate(listing) {
    if (!newUpdate.trim()) return;
    updateListing({...listing, seller_updates:[...listing.seller_updates, {id:Date.now(), date:today(), note:newUpdate}]});
    setNewUpdate("");
  }

  function addDeadline(listing) {
    if (!newDeadline.label || !newDeadline.date) return;
    updateListing({...listing, deadlines:[...listing.deadlines, {id:Date.now(), ...newDeadline, done:false}]});
    setNewDeadline({label:"", date:""});
  }

  function toggleDeadline(listing, id) {
    updateListing({...listing, deadlines: listing.deadlines.map(d => d.id===id ? {...d, done:!d.done} : d)});
  }

  function deleteListing(id) {
    setListings(prev => prev.filter(l => l.id!==id));
    setModal(null);
  }

  const sc = (status) => STATUS_COLORS[status] || STATUS_COLORS["Active"];
  const allDeadlines = listings.flatMap(l => l.deadlines.map(d => ({...d, address:l.address, agent:l.agent}))).sort((a,b)=>a.date.localeCompare(b.date));
  const allUpdates = listings.flatMap(l => l.seller_updates.map(u => ({...u, address:l.address, agent:l.agent}))).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="topbar">
          <div>
            <div className="topbar-title">🏠 TGG Transaction Coordinator</div>
            <div className="topbar-sub">Keller Williams Greater Des Moines</div>
          </div>
          <button className="btn btn-gold btn-sm" onClick={openAdd}>+ Add Listing</button>
        </div>

        <div className="nav">
          {TABS.map(t => <div key={t.key} className={`nav-tab ${tab===t.key?"active":""}`} onClick={()=>setTab(t.key)}>{t.label}</div>)}
        </div>

        <div className="content">
          {tab==="listings" && <>
            <div className="stats">
              <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-label">Total Active</div></div>
              <div className="stat-card"><div className="stat-num" style={{color:"#4338CA"}}>{stats.coming}</div><div className="stat-label">Coming Soon</div></div>
              <div className="stat-card"><div className="stat-num" style={{color:C.orange}}>{stats.preparing}</div><div className="stat-label">Preparing</div></div>
              <div className="stat-card"><div className="stat-num" style={{color:C.green}}>{stats.active}</div><div className="stat-label">Active</div></div>
            </div>
            <div className="filters">
              <input className="search-box" placeholder="🔍 Search address or seller..." value={search} onChange={e=>setSearch(e.target.value)} />
              <select className="filter-select" value={agentFilter} onChange={e=>setAgentFilter(e.target.value)}>
                <option value="All">All Agents</option>
                {AGENTS.map(a=><option key={a}>{a}</option>)}
              </select>
              <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                {["Coming Soon","Preparing for Market","Active"].map(s=><option key={s}>{s}</option>)}
              </select>
              <span style={{fontSize:12,color:C.muted}}>{filtered.length} listing{filtered.length!==1?"s":""}</span>
            </div>
            {filtered.length===0 ? <div className="empty"><div className="empty-icon">🏠</div><div className="empty-text">No listings found</div></div> :
            <div className="cards">
              {filtered.map(l => {
                const {done,total,pct} = progress(l.checklist);
                const s = sc(l.status);
                return <div key={l.id} className="card" onClick={()=>openView(l)}>
                  <div className="card-top">
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span className="badge" style={{background:s.bg,color:s.text,borderColor:s.border}}>{l.status}</span>
                      <span className="agent-tag">{l.agent}</span>
                    </div>
                    <div className="card-address">{l.address}</div>
                    <div className="card-meta">
                      {l.seller&&<span>{l.seller}</span>}
                      {l.listing_price&&<span> · {l.listing_price}</span>}
                      {l.supra&&l.supra!=="NA"&&<span> · Supra: {l.supra}</span>}
                      {l.door_code&&<span> · Code: {l.door_code}</span>}
                    </div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",fontSize:11,color:C.muted}}>
                      {l.days_on_market>0&&<span>📅 {l.days_on_market} DOM</span>}
                      {l.showing_count>0&&<span>👁 {l.showing_count} showings</span>}
                      {l.deadlines.filter(d=>!d.done).length>0&&<span style={{color:C.red}}>⏰ {l.deadlines.filter(d=>!d.done).length} deadline{l.deadlines.filter(d=>!d.done).length!==1?"s":""}</span>}
                    </div>
                    {l.notes&&<div style={{fontSize:12,color:C.gold,fontWeight:500,marginTop:5}}>📌 {l.notes.slice(0,65)}{l.notes.length>65?"...":""}</div>}
                  </div>
                  <div className="card-bottom">
                    <div className="progress-label"><span>Checklist</span><span style={{fontWeight:600,color:pct===100?C.green:C.text}}>{done}/{total}</span></div>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`,background:pct===100?C.green:C.blue}} /></div>
                  </div>
                </div>;
              })}
            </div>}
          </>}

          {tab==="pipeline" && <>
            <div className="filters">
              <select className="filter-select" value={agentFilter} onChange={e=>setAgentFilter(e.target.value)}>
                <option value="All">All Agents</option>
                {AGENTS.map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="pipeline">
              {PIPELINE_ORDER.map(status => {
                const cols = listings.filter(l=>l.status===status&&(agentFilter==="All"||l.agent===agentFilter));
                const s = sc(status);
                return <div key={status} className="pipeline-col">
                  <div className="pipeline-header">
                    <span style={{color:s.text}}>{status}</span>
                    <span className="pipeline-count">{cols.length}</span>
                  </div>
                  {cols.length===0&&<div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"16px 0"}}>No listings</div>}
                  {cols.map(l=>{
                    const {done,total} = progress(l.checklist);
                    return <div key={l.id} className="pipeline-card" onClick={()=>openView(l)}>
                      <div className="pipeline-address">{l.address}</div>
                      <div className="pipeline-meta" style={{marginBottom:5}}>
                        <span className="agent-tag" style={{marginRight:5}}>{l.agent}</span>
                        {l.seller&&<span>{l.seller.slice(0,25)}{l.seller.length>25?"...":""}</span>}
                      </div>
                      {l.notes&&<div style={{fontSize:11,color:C.gold,marginBottom:4}}>📌 {l.notes.slice(0,45)}...</div>}
                      <div className="progress-bar"><div className="progress-fill" style={{width:`${Math.round((done/total)*100)}%`,background:C.blue}} /></div>
                      <div style={{fontSize:10,color:C.muted,marginTop:2}}>{done}/{total} tasks</div>
                    </div>;
                  })}
                </div>;
              })}
            </div>
          </>}

          {tab==="updates" && <>
            <div style={{marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:700,color:C.navy}}>📬 All Seller Updates</div>
              <span style={{fontSize:12,color:C.muted}}>{allUpdates.length} total</span>
            </div>
            {allUpdates.length===0 ? <div className="empty"><div className="empty-icon">📬</div><div className="empty-text">No seller updates yet</div><div style={{fontSize:13}}>Open a listing and log updates in the Updates tab</div></div> :
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              {allUpdates.map((u,i)=><div key={u.id} style={{padding:"12px 16px",borderBottom:i<allUpdates.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontWeight:600,color:C.navy,fontSize:13}}>{u.address}</div>
                  <div style={{fontSize:11,color:C.muted}}>{u.date}</div>
                </div>
                <div style={{fontSize:11,marginBottom:4}}><span className="agent-tag">{u.agent}</span></div>
                <div style={{fontSize:13,color:C.text}}>{u.note}</div>
              </div>)}
            </div>}
          </>}

          {tab==="deadlines" && <>
            <div style={{marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:15,fontWeight:700,color:C.navy}}>⏰ All Deadlines</div>
              <span style={{fontSize:12,color:C.muted}}>{allDeadlines.filter(d=>!d.done).length} pending</span>
            </div>
            {allDeadlines.length===0 ? <div className="empty"><div className="empty-icon">⏰</div><div className="empty-text">No deadlines set</div><div style={{fontSize:13}}>Open a listing and add deadlines in the Deadlines tab</div></div> :
            allDeadlines.map(d=>{
              const overdue = !d.done && d.date < today();
              return <div key={d.id} className={`deadline-item ${d.done?"done":overdue?"overdue":""}`}>
                <input type="checkbox" checked={d.done} readOnly style={{width:15,height:15}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:d.done?C.green:overdue?C.red:C.navy}}>{d.label}</div>
                  <div style={{fontSize:11,color:C.muted}}>{d.address} · <span className="agent-tag">{d.agent}</span></div>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:d.done?C.green:overdue?C.red:C.muted}}>{d.date}{overdue?" ⚠️":""}</div>
              </div>;
            })}
          </>}

          {tab==="rules" && <>
            <div style={{marginBottom:20,fontSize:15,fontWeight:700,color:C.navy}}>📌 Rules & Reminders</div>
            <div style={{display:"grid",gap:14}}>
              {RULES.map(r=><div key={r.category} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{background:r.colorlt,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>{r.icon}</span>
                  <span style={{fontWeight:700,fontSize:14,color:r.color}}>{r.category}</span>
                </div>
                <div style={{padding:"12px 16px"}}>
                  {r.rules.map((rule,i)=><div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<r.rules.length-1?`1px solid ${C.border}`:"none"}}>
                    <span style={{color:r.color,fontWeight:700,fontSize:13,minWidth:16}}>→</span>
                    <span style={{fontSize:13,color:C.text,lineHeight:1.6}}>{rule}</span>
                  </div>)}
                </div>
              </div>)}
            </div>
          </>}

          {tab==="mls" && <>
            <div style={{marginBottom:16,fontSize:15,fontWeight:700,color:C.navy}}>📝 MLS Notes & Remarks Drafts</div>
            {listings.filter(l=>l.mls_notes||l.remarks_draft).length===0 ?
              <div className="empty"><div className="empty-icon">📝</div><div className="empty-text">No MLS notes yet</div><div style={{fontSize:13}}>Open a listing and add notes in the MLS tab</div></div> :
              <div style={{display:"grid",gap:12}}>
                {listings.filter(l=>l.mls_notes||l.remarks_draft).map(l=><div key={l.id} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{fontWeight:700,color:C.navy}}>{l.address}</div>
                    <span className="agent-tag">{l.agent}</span>
                  </div>
                  {l.mls_notes&&<><div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:5}}>Notes</div><div style={{fontSize:13,color:C.text,lineHeight:1.6,marginBottom:10}}>{l.mls_notes}</div></>}
                  {l.remarks_draft&&<><div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:5}}>Remarks Draft</div><div className="notes-box">{l.remarks_draft}</div></>}
                  <button className="btn btn-secondary btn-sm" onClick={()=>openView(l)}>Open Listing →</button>
                </div>)}
              </div>}
          </>}
        </div>

        {/* VIEW MODAL */}
        {modal==="view" && active && (()=>{
          const {done,total,pct} = progress(active.checklist);
          const s = sc(active.status);
          return <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
            <div className="modal">
              <div className="modal-header">
                <div>
                  <div className="modal-title">{active.address}</div>
                  <div className="modal-sub">{active.seller} · {active.agent} · <span style={{color:"#93C5FD"}}>{active.status}</span></div>
                </div>
                <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
              </div>
              <div className="modal-tabs">
                {[["details","📋 Details"],["checklist",`✅ Checklist (${done}/${total})`],["updates",`📬 Updates (${active.seller_updates.length})`],["deadlines",`⏰ Deadlines (${active.deadlines.length})`],["mls","📝 MLS Notes"]].map(([k,l])=>
                  <div key={k} className={`modal-tab ${modalTab===k?"active":""}`} onClick={()=>setModalTab(k)}>{l}</div>
                )}
              </div>
              <div className="modal-body">
                {modalTab==="details"&&<>
                  <div className="info-row">
                    <span className="badge" style={{background:s.bg,color:s.text,borderColor:s.border}}>{active.status}</span>
                    <span className="agent-tag">{active.agent}</span>
                    {active.type&&<span className="info-pill">{active.type}</span>}
                    {active.listing_price&&<span className="info-pill"><strong>Price:</strong> {active.listing_price}</span>}
                    {active.days_on_market>0&&<span className="info-pill"><strong>DOM:</strong> {active.days_on_market}</span>}
                    {active.showing_count>0&&<span className="info-pill"><strong>Showings:</strong> {active.showing_count}</span>}
                  </div>
                  <div className="form-grid" style={{marginBottom:0}}>
                    {[["Seller",active.seller],["Listing Date",active.listing_date],["Supra Box #",active.supra],["Door Code",active.door_code],["Photo Date/Time",active.photo_datetime],["Matterport Date",active.matterport_date],["Seller Phone",active.seller_phone],["Seller Email",active.seller_email]].map(([label,val])=>
                      <div key={label}><div className="form-label">{label}</div><div style={{fontSize:13,padding:"6px 0",color:val?C.text:C.muted}}>{val||"—"}</div></div>
                    )}
                  </div>
                  {active.notes&&<><div className="section-label">Notes</div><div className="notes-box">{active.notes}</div></>}
                  {active.staging_bid&&<><div className="section-label">Staging</div><div style={{fontSize:13}}>{active.staging_bid}</div></>}
                  <div className="section-label">Checklist Progress</div>
                  <div style={{background:C.bg,borderRadius:8,padding:"10px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13,fontWeight:600}}><span>Overall</span><span style={{color:pct===100?C.green:C.blue}}>{pct}%</span></div>
                    <div className="progress-bar" style={{height:8}}><div className="progress-fill" style={{width:`${pct}%`,background:pct===100?C.green:C.blue}} /></div>
                  </div>
                </>}

                {modalTab==="checklist"&&<>
                  <div style={{fontSize:13,color:C.muted,marginBottom:12}}>Click any item to mark complete. Saves instantly.</div>
                  <div className="checklist-grid">
                    {CHECKLIST_ITEMS.map(item=><div key={item.key} className={`check-item ${active.checklist[item.key]?"checked":""}`} onClick={()=>toggleCheck(active,item.key)}>
                      <input type="checkbox" checked={active.checklist[item.key]} readOnly />
                      <span className="check-item-label">{item.label}</span>
                    </div>)}
                  </div>
                </>}

                {modalTab==="updates"&&<>
                  <div style={{marginBottom:14}}>
                    <div className="form-label" style={{marginBottom:6}}>Log New Update</div>
                    <textarea className="form-input form-textarea" style={{width:"100%",marginBottom:8}} placeholder="What did you communicate to the seller today?" value={newUpdate} onChange={e=>setNewUpdate(e.target.value)} />
                    <button className="btn btn-primary btn-sm" onClick={()=>addUpdate(active)}>+ Add Update</button>
                  </div>
                  {active.seller_updates.length===0 ? <div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>No updates logged yet</div> :
                  [...active.seller_updates].reverse().map(u=><div key={u.id} className="update-item">
                    <div className="update-date">📅 {u.date}</div>
                    <div className="update-note">{u.note}</div>
                  </div>)}
                </>}

                {modalTab==="deadlines"&&<>
                  <div style={{marginBottom:14}}>
                    <div className="form-label" style={{marginBottom:6}}>Add Deadline</div>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <input className="form-input" style={{flex:2}} placeholder="e.g. Inspection period, Closing date..." value={newDeadline.label} onChange={e=>setNewDeadline(p=>({...p,label:e.target.value}))} />
                      <input type="date" className="form-input" style={{flex:1}} value={newDeadline.date} onChange={e=>setNewDeadline(p=>({...p,date:e.target.value}))} />
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={()=>addDeadline(active)}>+ Add Deadline</button>
                  </div>
                  {active.deadlines.length===0 ? <div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>No deadlines set yet</div> :
                  active.deadlines.map(d=>{
                    const overdue = !d.done && d.date < today();
                    return <div key={d.id} className={`deadline-item ${d.done?"done":overdue?"overdue":""}`} onClick={()=>toggleDeadline(active,d.id)}>
                      <input type="checkbox" checked={d.done} readOnly style={{width:15,height:15}} />
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13,color:d.done?C.green:overdue?C.red:C.navy}}>{d.label}</div>
                        {overdue&&<div style={{fontSize:11,color:C.red}}>Overdue!</div>}
                      </div>
                      <div style={{fontSize:12,fontWeight:600,color:d.done?C.green:overdue?C.red:C.muted}}>{d.date}{overdue?" ⚠️":""}</div>
                    </div>;
                  })}
                </>}

                {modalTab==="mls"&&<>
                  <div className="form-group" style={{marginBottom:14}}>
                    <label className="form-label">MLS Notes / Comp Notes</label>
                    <textarea className="form-input form-textarea" value={active.mls_notes||""} onChange={e=>updateListing({...active,mls_notes:e.target.value})} placeholder="Notes about this listing, comps, pricing strategy..." style={{width:"100%"}} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Public Remarks Draft</label>
                    <textarea className="form-input form-textarea" style={{minHeight:120,width:"100%"}} value={active.remarks_draft||""} onChange={e=>updateListing({...active,remarks_draft:e.target.value})} placeholder="Draft your MLS public remarks here..." />
                  </div>
                </>}
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger btn-sm" onClick={()=>{if(window.confirm("Delete this listing?"))deleteListing(active.id);}}>Delete</button>
                <button className="btn btn-secondary" onClick={()=>setModal(null)}>Close</button>
                <button className="btn btn-primary" onClick={()=>openEdit(active)}>✏️ Edit</button>
              </div>
            </div>
          </div>;
        })()}

        {/* EDIT MODAL */}
        {modal==="edit" && form && <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{form.address||"New Listing"}</div>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full"><label className="form-label">Property Address</label><input className="form-input" value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} placeholder="123 Main St, Des Moines" /></div>
                <div className="form-group"><label className="form-label">Seller Name</label><input className="form-input" value={form.seller} onChange={e=>setForm(p=>({...p,seller:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Agent</label><select className="form-select form-input" value={form.agent} onChange={e=>setForm(p=>({...p,agent:e.target.value}))}>{AGENTS.map(a=><option key={a}>{a}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Status</label><select className="form-select form-input" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Type</label><select className="form-select form-input" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}><option>RES</option><option>COM</option><option>MULTI</option><option>LAND</option></select></div>
                <div className="form-group"><label className="form-label">Listing Price</label><input className="form-input" value={form.listing_price} onChange={e=>setForm(p=>({...p,listing_price:e.target.value}))} placeholder="$250,000" /></div>
                <div className="form-group"><label className="form-label">Listing Date</label><input type="date" className="form-input" value={form.listing_date} onChange={e=>setForm(p=>({...p,listing_date:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Days on Market</label><input type="number" className="form-input" value={form.days_on_market} onChange={e=>setForm(p=>({...p,days_on_market:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Showing Count</label><input type="number" className="form-input" value={form.showing_count} onChange={e=>setForm(p=>({...p,showing_count:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Supra Box #</label><input className="form-input" value={form.supra} onChange={e=>setForm(p=>({...p,supra:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Door Code</label><input className="form-input" value={form.door_code} onChange={e=>setForm(p=>({...p,door_code:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Seller Phone</label><input className="form-input" value={form.seller_phone} onChange={e=>setForm(p=>({...p,seller_phone:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Seller Email</label><input className="form-input" value={form.seller_email} onChange={e=>setForm(p=>({...p,seller_email:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Photo Date/Time</label><input className="form-input" value={form.photo_datetime} onChange={e=>setForm(p=>({...p,photo_datetime:e.target.value}))} placeholder="e.g. June 23 10am" /></div>
                <div className="form-group"><label className="form-label">Matterport Date</label><input className="form-input" value={form.matterport_date} onChange={e=>setForm(p=>({...p,matterport_date:e.target.value}))} placeholder="e.g. June 23 11am" /></div>
                <div className="form-group full"><label className="form-label">Staging Notes</label><input className="form-input" value={form.staging_bid} onChange={e=>setForm(p=>({...p,staging_bid:e.target.value}))} placeholder="Staging bid status, notes..." /></div>
                <div className="form-group full"><label className="form-label">Notes</label><textarea className="form-input form-textarea" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Important notes about this listing..." /></div>
              </div>
              <div className="section-label">Checklist</div>
              <div className="checklist-grid">
                {CHECKLIST_ITEMS.map(item=><div key={item.key} className={`check-item ${form.checklist[item.key]?"checked":""}`} onClick={()=>setForm(p=>({...p,checklist:{...p.checklist,[item.key]:!p.checklist[item.key]}}))}>
                  <input type="checkbox" checked={form.checklist[item.key]} readOnly />
                  <span className="check-item-label">{item.label}</span>
                </div>)}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveForm}>💾 Save Listing</button>
            </div>
          </div>
        </div>}
      </div>
    </>
  );
}
