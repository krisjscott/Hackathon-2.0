import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, MapPin, FileText, HelpCircle, BellRing, Download, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quickSearch, setQuickSearch] = useState({ propertyId: '', registrationNumber: '' });
  const [advancedSearch, setAdvancedSearch] = useState({
    propertyType: '',
    district: '',
    areaType: 'both',
    regDateFrom: '',
    regDateTo: '',
  });
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState('');
  
  // Reference to the quick search section
  const quickSearchRef = useRef<HTMLDivElement>(null);

  // Function to scroll to quick search section
  const scrollToQuickSearch = () => {
    quickSearchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary-600" />,
      title: 'Easy Property Search',
      description: 'Search properties by ID, registration number, or location across India'
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-600" />,
      title: 'Urban & Rural Coverage',
      description: 'Complete coverage of all property types in both urban and rural areas'
    },
    {
      icon: <FileText className="w-8 h-8 text-primary-600" />,
      title: 'Official Records',
      description: 'Access to official government property records and certificates'
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-primary-600" />,
      title: '24/7 Support',
      description: 'Get help anytime through our dedicated helpline and support channels'
    }
  ];

  const updates = [
    {
      date: '15 Jun 2025',
      title: 'New property verification system launched',
      category: 'System Update'
    },
    {
      date: '10 Jun 2025',
      title: 'Rural property records for Karnataka updated',
      category: 'Data Update'
    },
    {
      date: '05 Jun 2025',
      title: 'Maintenance scheduled for June 20th',
      category: 'Maintenance'
    }
  ];

  // Export to PDF function
  const exportToPDF = () => {
    if (searchResults.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Property Search Results', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    let y = 40;
    
    searchResults.forEach((result, index) => {
      if (y > 270) { // Check if we need a new page
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`Property ${index + 1}`, 14, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.text(`Property Number: ${result['Property Number'] || 'N/A'}`, 20, y);
      y += 6;
      doc.text(`Registration Number: ${result['Registration Number'] || 'N/A'}`, 20, y);
      y += 6;
      doc.text(`Owner: ${result['Owner Name'] || 'N/A'}`, 20, y);
      y += 6;
      doc.text(`Location: ${result['District'] || 'N/A'}, ${result['State'] || 'N/A'}`, 20, y);
      y += 6;
      doc.text(`Property Type: ${result['Property Type'] || 'N/A'} (${result['Area Type'] || 'N/A'})`, 20, y);
      y += 6;
      doc.text(`Status: ${result['Status'] || 'N/A'}`, 20, y);
      y += 6;
      doc.text(`Date Issued: ${result['Date Issued'] || 'N/A'} | Date Expired: ${result['Date Expired'] || 'N/A'}`, 20, y);
      y += 15;
    });
    
    doc.save('property-search-results.pdf');
  };
  
  // Export to Excel function
  const exportToExcel = () => {
    if (searchResults.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(searchResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Property Results');
    XLSX.writeFile(workbook, 'property-search-results.xlsx');
  };

  const handleQuickSearch = async () => {
    setSearchResults([]);
    setSearchError('');
    if (!quickSearch.propertyId || !quickSearch.registrationNumber) {
      setSearchError('Please enter both Property ID and Registration Number.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/property?propertyId=${encodeURIComponent(quickSearch.propertyId)}&registrationNumber=${encodeURIComponent(quickSearch.registrationNumber)}`);
      if (!res.ok) throw new Error('Property not found');
      const data = await res.json();
      setSearchResults(data ? [data] : []);
      if (!data) setSearchError('Property not found.');
    } catch (err) {
      setSearchError('Property not found.');
    }
  };

  const handleAdvancedSearch = async () => {
    setSearchResults([]);
    setSearchError('');
    if (!advancedSearch.propertyType && !advancedSearch.district && !advancedSearch.areaType && !advancedSearch.regDateFrom && !advancedSearch.regDateTo) {
      setSearchError('Please provide at least one search criterion.');
      return;
    }
    try {
      const params = new URLSearchParams();
      if (advancedSearch.propertyType) params.append('propertyType', advancedSearch.propertyType);
      if (advancedSearch.district) params.append('district', advancedSearch.district);
      if (advancedSearch.areaType) params.append('areaType', advancedSearch.areaType);
      if (advancedSearch.regDateFrom) params.append('regDateFrom', advancedSearch.regDateFrom);
      if (advancedSearch.regDateTo) params.append('regDateTo', advancedSearch.regDateTo);
      const res = await fetch(`http://localhost:5000/properties?${params.toString()}`);
      if (!res.ok) throw new Error('No properties found');
      let data = await res.json();
      if (!Array.isArray(data)) data = [data];

      // Filter by registration date range if both are provided
      if (advancedSearch.regDateFrom && advancedSearch.regDateTo) {
        const fromParts = advancedSearch.regDateFrom.split('-');
        const toParts = advancedSearch.regDateTo.split('-');
        const fromDate = new Date(Number(fromParts[0]), Number(fromParts[1]) - 1, 1);
        const toDate = new Date(Number(toParts[0]), Number(toParts[1]) - 1, 31);
        data = data.filter((item: Record<string, any>) => {
          if (!item['Date Issued']) return false;
          const issuedDate = new Date(item['Date Issued']);
          return issuedDate >= fromDate && issuedDate <= toDate;
        });
      }

      // Filter by district if provided
      if (advancedSearch.district) {
        data = data.filter((item: Record<string, any>) =>
          item['District'] && item['District'].toLowerCase() === advancedSearch.district.toLowerCase()
        );
      }

      // Filter by area type if provided and not 'both'
      if (advancedSearch.areaType && advancedSearch.areaType !== 'both') {
        data = data.filter((item: Record<string, any>) =>
          item['Area Type'] && item['Area Type'].toLowerCase() === advancedSearch.areaType.toLowerCase()
        );
      }

      // Filter by property type if provided and not empty
      if (advancedSearch.propertyType) {
        data = data.filter((item: Record<string, any>) =>
          item['Property Type'] && item['Property Type'].toLowerCase() === advancedSearch.propertyType.toLowerCase()
        );
      }

      data.sort((a: Record<string, any>, b: Record<string, any>) => {
        let scoreA = 0, scoreB = 0;
        if (advancedSearch.regDateFrom && a['Date Issued'] && a['Date Issued'].slice(5,7) === advancedSearch.regDateFrom.split('-')[1]) scoreA++;
        if (advancedSearch.regDateFrom && b['Date Issued'] && b['Date Issued'].slice(5,7) === advancedSearch.regDateFrom.split('-')[1]) scoreB++;
        if (advancedSearch.district && a['District'] === advancedSearch.district) scoreA++;
        if (advancedSearch.district && b['District'] === advancedSearch.district) scoreB++;
        if (advancedSearch.areaType && a['Area Type'] && a['Area Type'].toLowerCase() === advancedSearch.areaType.toLowerCase()) scoreA++;
        if (advancedSearch.areaType && b['Area Type'] && b['Area Type'].toLowerCase() === advancedSearch.areaType.toLowerCase()) scoreB++;
        return scoreB - scoreA;
      });
      setSearchResults(data.slice(0, 6));
      if (data.length === 0) setSearchError('No properties available for the selected criteria.');
    } catch (err) {
      setSearchError('No properties available for the selected criteria.');
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {t('home.welcome')}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">
                {t('home.description')}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={scrollToQuickSearch}
                  className="btn bg-accent-500 hover:bg-accent-600 text-white text-lg px-6 py-3"
                >
                  <Search className="inline-block mr-2 h-5 w-5" />
                  {t('home.startSearch')}
                </button>
                <Link to="/login" className="btn bg-white/10 hover:bg-white/20 text-white text-lg px-6 py-3 backdrop-blur-sm">
                  {t('home.loginPrompt')}
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img
                src="https://images.pexels.com/photos/3786308/pexels-photo-3786308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Property search illustration"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-10 bg-white" ref={quickSearchRef}>
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 -mt-16 md:-mt-20 relative z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-primary-700">
              Quick Property Search
            </h2>
            {!showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label htmlFor="quickPropertyId" className="form-label">
                  {t('search.propertyId')}
                </label>
                <input
                  type="text"
                  id="quickPropertyId"
                  className="form-input"
                  placeholder="Enter property ID"
                    value={quickSearch.propertyId}
                    onChange={e => setQuickSearch(q => ({ ...q, propertyId: e.target.value }))}
                    disabled={showAdvanced}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="quickRegistrationNumber" className="form-label">
                  {t('search.registrationNumber')}
                </label>
                <input
                  type="text"
                  id="quickRegistrationNumber"
                  className="form-input"
                  placeholder="Enter registration number"
                    value={quickSearch.registrationNumber}
                    onChange={e => setQuickSearch(q => ({ ...q, registrationNumber: e.target.value }))}
                    disabled={showAdvanced}
                />
              </div>
              <div className="flex items-end">
                  <button className="btn btn-primary w-full" disabled={showAdvanced} onClick={handleQuickSearch} type="button">
                  <Search className="inline-block mr-2 h-4 w-4" />
                  Quick Search
                </button>
              </div>
            </div>
            )}
            {showAdvanced && (
              <div className="mt-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary-700 text-left">Advanced Search Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="propertyType" className="form-label">Property Type</label>
                      <select
                        id="propertyType"
                        className="form-input"
                        value={advancedSearch.propertyType}
                        onChange={e => setAdvancedSearch(a => ({ ...a, propertyType: e.target.value }))}
                      >
                        <option value="">All Types</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="agricultural">Agricultural</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="district" className="form-label">District</label>
                      <input
                        type="text"
                        id="district"
                        className="form-input"
                        placeholder="Enter district"
                        value={advancedSearch.district}
                        onChange={e => setAdvancedSearch(a => ({ ...a, district: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="areaType" className="form-label">Area Type</label>
                      <select
                        id="areaType"
                        className="form-input"
                        value={advancedSearch.areaType}
                        onChange={e => setAdvancedSearch(a => ({ ...a, areaType: e.target.value }))}
                      >
                        <option value="both">Both</option>
                        <option value="urban">Urban</option>
                        <option value="rural">Rural</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="regDateFrom" className="form-label">Registration Date (From)</label>
                        <div className="flex gap-2">
                          <select
                            id="regDateFromMonth"
                            className="form-input"
                            value={advancedSearch.regDateFrom.split('-')[1] || ''}
                            onChange={e => setAdvancedSearch(a => ({ ...a, regDateFrom: `${a.regDateFrom.split('-')[0] || currentYear}-${e.target.value}` }))}
                          >
                            <option value="">Month</option>
                            {months.map((m, idx) => (
                              <option key={m} value={String(idx + 1).padStart(2, '0')}>{m}</option>
                            ))}
                          </select>
                          <select
                            id="regDateFromYear"
                            className="form-input"
                            value={advancedSearch.regDateFrom.split('-')[0] || ''}
                            onChange={e => setAdvancedSearch(a => ({ ...a, regDateFrom: `${e.target.value}-${a.regDateFrom.split('-')[1] || '01'}` }))}
                          >
                            <option value="">Year</option>
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="regDateTo" className="form-label">Registration Date (To)</label>
                        <div className="flex gap-2">
                          <select
                            id="regDateToMonth"
                            className="form-input"
                            value={advancedSearch.regDateTo.split('-')[1] || ''}
                            onChange={e => setAdvancedSearch(a => ({ ...a, regDateTo: `${a.regDateTo.split('-')[0] || currentYear}-${e.target.value}` }))}
                          >
                            <option value="">Month</option>
                            {months.map((m, idx) => (
                              <option key={m} value={String(idx + 1).padStart(2, '0')}>{m}</option>
                            ))}
                          </select>
                          <select
                            id="regDateToYear"
                            className="form-input"
                            value={advancedSearch.regDateTo.split('-')[0] || ''}
                            onChange={e => setAdvancedSearch(a => ({ ...a, regDateTo: `${e.target.value}-${a.regDateTo.split('-')[1] || '01'}` }))}
                          >
                            <option value="">Year</option>
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button className="btn btn-primary px-8 py-2 text-lg" type="button" onClick={handleAdvancedSearch}>Search</button>
                  </div>
                </div>
              </div>
            )}
            <div className="relative flex justify-center items-center my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative z-10 bg-white px-4">
                <button
                  className="rounded-full border border-primary-300 bg-primary-50 shadow-md px-6 py-2 text-primary-700 font-semibold hover:bg-primary-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  type="button"
                >
                  {showAdvanced ? 'Hide Advanced Search Options' : 'Show Advanced Search Options'}
                </button>
              </span>
            </div>
            {(searchResults.length > 0 || searchError) && (
              <div className="mt-8">
                {searchError && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{searchError}</div>
                )}
                {searchResults.length > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={exportToPDF}
                          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <FileTextIcon className="w-4 h-4 mr-1" />
                          Export PDF
                        </button>
                        <button
                          onClick={exportToExcel}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <FileSpreadsheetIcon className="w-4 h-4 mr-1" />
                          Export Excel
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {searchResults.map((result, idx) => {
                        // Status extraction logic
                        let status = 'Legal';
                        let statusReason = undefined;
                        if (result.Status) {
                          const match = result.Status.match(/^(LEGAL|ILLEGAL)(?: \((.+)\))?$/i);
                          if (match) {
                            status = match[1].toUpperCase() === 'LEGAL' ? 'Legal' : 'Not Legal';
                            if (match[2]) statusReason = match[2];
                          } else {
                            status = result.Status;
                          }
                        }
                        return (
                          <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold mb-4 text-green-800 text-center">Property Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Property Number</div>
                                <div className="font-semibold text-lg">{result['Property Number']}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Registration Number</div>
                                <div className="font-semibold text-lg">{result['Registration Number']}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Name</div>
                                <div className="font-semibold">{result['Owner Name'] ? result['Owner Name'] : 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">State</div>
                                <div className="font-semibold">{result['State'] || 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">District</div>
                                <div className="font-semibold">{result['District'] || 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Sub-District</div>
                                <div className="font-semibold">{result['Sub-District'] || 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Property Type</div>
                                <div className="font-semibold">{result['Property Type'] || 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Area Type</div>
                                <div className="font-semibold">{result['Area Type'] || 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Date Issued</div>
                                <div className="font-semibold">{result['Date Issued'] || 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Date Expired</div>
                                <div className="font-semibold">{result['Date Expired'] || 'N/A'}</div>
                              </div>
                              <div className="bg-white rounded shadow p-4">
                                <div className="text-gray-500 text-xs mb-1">Status</div>
                                {status === "Legal" ? (
                                  <div className="font-semibold text-green-700">Legal</div>
                                ) : (
                                  <div>
                                    <div className="font-semibold text-red-700">Not Legal</div>
                                    {statusReason && (
                                      <div className="mt-1 text-xs text-red-600 font-semibold">Reason: {statusReason}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-primary-700">
            Essential Property Search Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const isActive = activeFeature === index;
              const isHovered = hoveredFeature === index;
              return (
                <div key={index} className="relative">
                  <div
                    className={`card transition-transform slide-up cursor-pointer 
                      ${isActive || isHovered ? 'z-20 shadow-2xl border-2 border-primary-300 scale-105' : 'hover:z-10 hover:shadow-xl hover:border-primary-200 hover:scale-105'}
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveFeature(index)}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                <div className="mb-4 rounded-full bg-primary-50 p-4 inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary-700">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
                  {isActive && (
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 bg-white border border-primary-200 shadow-2xl rounded-xl px-8 py-6 flex flex-col items-center min-w-[280px] max-w-xs" style={{zIndex: 30}}>
                      <h3 className="text-xl font-bold mb-2 text-primary-700 text-center">{feature.title}</h3>
                      <p className="text-gray-600 text-center mb-4">{feature.description}</p>
                      <button
                        className="btn bg-primary-700 text-white px-6 py-2 rounded-lg mt-2 hover:bg-primary-800 focus:outline-none"
                        onClick={e => { e.stopPropagation(); setActiveFeature(null); }}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Updates & Help Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Recent Updates */}
            <div>
              <div className="flex items-center mb-6">
                <BellRing className="w-6 h-6 text-accent-500 mr-3" />
                <h2 className="text-2xl font-bold text-primary-700">
                  {t('home.recentUpdates')}
                </h2>
              </div>
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-primary-600">{update.date}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                        {update.category}
                      </span>
                    </div>
                    <h3 className="font-medium">{update.title}</h3>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <a href="#" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  View all updates →
                </a>
              </div>
            </div>

            {/* Help Section */}
            <div>
              <div className="flex items-center mb-6">
                <HelpCircle className="w-6 h-6 text-accent-500 mr-3" />
                <h2 className="text-2xl font-bold text-primary-700">
                  {t('home.helpSection')}
                </h2>
              </div>
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-primary-700">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-primary-800 mb-1">How do I search for a property?</h4>
                    <p className="text-sm text-gray-600">You can search using property ID, registration number, owner name, or address.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-800 mb-1">What documents do I need for verification?</h4>
                    <p className="text-sm text-gray-600">You'll need government-issued ID and property documents for verification.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-800 mb-1">How often is the database updated?</h4>
                    <p className="text-sm text-gray-600">Property records are updated in real-time as changes are registered with the authorities.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a href="#" className="btn btn-outline w-full flex justify-center items-center">
                    View Complete Help Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to find property information?
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Access official property records from anywhere in India with our secure, government-authorized platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-3">
              Create an Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;