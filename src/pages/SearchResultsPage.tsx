import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Filter, 
  ArrowUpDown, 
  MapPin, 
  Calendar, 
  Home,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Mock data - in a real app, this would come from an API
const mockProperties = [
  {
    id: 'PROP123456',
    registrationNumber: 'REG123456789',
    owner: 'Vikram Singh',
    address: '123 Main Street, Sector 15, New Delhi',
    area: 'urban',
    landSize: '250 sq.m',
    status: 'registered',
    classification: 'residential',
    lastUpdated: '2025-05-10',
  },
  {
    id: 'PROP234567',
    registrationNumber: 'REG234567890',
    owner: 'Priya Sharma',
    address: '456 Park Avenue, Juhu, Mumbai',
    area: 'urban',
    landSize: '300 sq.m',
    status: 'registered',
    classification: 'residential',
    lastUpdated: '2025-04-22',
  },
  {
    id: 'PROP345678',
    registrationNumber: 'REG345678901',
    owner: 'Rajesh Kumar',
    address: 'Plot 56, Industrial Area, Bangalore',
    area: 'urban',
    landSize: '1200 sq.m',
    status: 'registered',
    classification: 'industrial',
    lastUpdated: '2025-05-05',
  },
  {
    id: 'PROP456789',
    registrationNumber: 'REG456789012',
    owner: 'Ananya Patel',
    address: 'Village Ambala, Dist. Gurdaspur, Punjab',
    area: 'rural',
    landSize: '5000 sq.m',
    status: 'registered',
    classification: 'agricultural',
    lastUpdated: '2025-03-15',
  },
  {
    id: 'PROP567890',
    registrationNumber: 'REG567890123',
    owner: 'Mohammed Iqbal',
    address: '789 Business Center, Anna Salai, Chennai',
    area: 'urban',
    landSize: '450 sq.m',
    status: 'registered',
    classification: 'commercial',
    lastUpdated: '2025-04-30',
  },
];

interface SearchCriteria {
  propertyId: string;
  registrationNumber: string;
  ownerName: string;
  address: string;
  area: string;
}

const SearchResultsPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchCriteria = location.state?.searchCriteria as SearchCriteria;
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<typeof mockProperties>([]);
  const [filteredResults, setFilteredResults] = useState<typeof mockProperties>([]);
  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    area: searchCriteria?.area || 'both',
    classification: '',
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  // Simulate API call
  useEffect(() => {
    setLoading(true);
    
    // In a real app, this would be an API call with the search criteria
    setTimeout(() => {
      let filtered = [...mockProperties];
      
      if (searchCriteria?.propertyId) {
        filtered = filtered.filter(p => 
          p.id.toLowerCase().includes(searchCriteria.propertyId.toLowerCase())
        );
      }
      
      if (searchCriteria?.registrationNumber) {
        filtered = filtered.filter(p => 
          p.registrationNumber.toLowerCase().includes(searchCriteria.registrationNumber.toLowerCase())
        );
      }
      
      if (searchCriteria?.ownerName) {
        filtered = filtered.filter(p => 
          p.owner.toLowerCase().includes(searchCriteria.ownerName.toLowerCase())
        );
      }
      
      if (searchCriteria?.address) {
        filtered = filtered.filter(p => 
          p.address.toLowerCase().includes(searchCriteria.address.toLowerCase())
        );
      }
      
      if (searchCriteria?.area && searchCriteria.area !== 'both') {
        filtered = filtered.filter(p => p.area === searchCriteria.area);
      }
      
      setResults(filtered);
      setFilteredResults(filtered);
      setLoading(false);
    }, 1500);
  }, [searchCriteria]);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...results];
    
    // Apply area filter
    if (filters.area !== 'both') {
      filtered = filtered.filter(p => p.area === filters.area);
    }
    
    // Apply classification filter
    if (filters.classification) {
      filtered = filtered.filter(p => p.classification === filters.classification);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a] as string;
      const fieldB = b[sortField as keyof typeof b] as string;
      
      if (sortDirection === 'asc') {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });
    
    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [filters, sortField, sortDirection, results]);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  if (loading) {
    return <LoadingSpinner text="Searching property records..." />;
  }
  
  return (
    <div className="fade-in py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-700">
                {t('results.title')}
              </h1>
              <Link to="/search" className="text-primary-600 hover:text-primary-800 flex items-center">
                <ChevronLeft size={16} className="mr-1" />
                Back to Search
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
              {filteredResults.length > 0 ? (
                <p className="text-gray-600 mb-2 sm:mb-0">
                  {t('results.count', { count: filteredResults.length })}
                </p>
              ) : (
                <p className="text-gray-600 mb-2 sm:mb-0">
                  {t('results.noResults')}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center">
                  <Filter size={16} className="mr-1 text-gray-500" />
                  <label className="text-sm text-gray-500 mr-2">Filter by:</label>
                  <select
                    name="classification"
                    value={filters.classification}
                    onChange={handleFilterChange}
                    className="form-input text-sm py-1 px-2"
                  >
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <ArrowUpDown size={16} className="mr-1 text-gray-500" />
                  <label className="text-sm text-gray-500 mr-2">Sort by:</label>
                  <select
                    value={sortField}
                    onChange={(e) => handleSort(e.target.value)}
                    className="form-input text-sm py-1 px-2"
                  >
                    <option value="lastUpdated">Last Updated</option>
                    <option value="id">Property ID</option>
                    <option value="owner">Owner Name</option>
                    <option value="landSize">Land Size</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {filteredResults.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <img 
                src="https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="No results" 
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 opacity-70"
              />
              <h2 className="text-xl font-bold text-gray-700 mb-2">No Properties Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any properties matching your search criteria.
              </p>
              <Link to="/search" className="btn btn-primary">
                {t('results.refineSearch')}
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {currentItems.map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg slide-up"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      <div className="md:col-span-1 bg-primary-50 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="text-center">
                          <div className="bg-primary-100 rounded-full p-3 inline-block mb-3">
                            <Home size={28} className="text-primary-700" />
                          </div>
                          <h3 className="text-xl font-bold text-primary-700 mb-1">
                            {property.id}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {property.classification.charAt(0).toUpperCase() + property.classification.slice(1)}
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            property.area === 'urban' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {property.area === 'urban' ? 'Urban' : 'Rural'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="md:col-span-3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              Property of {property.owner}
                            </h3>
                            <p className="text-gray-600 flex items-center mt-1">
                              <MapPin size={16} className="mr-1 text-gray-500" />
                              {property.address}
                            </p>
                          </div>
                          <Link 
                            to={`/property/${property.id}`} 
                            className="btn bg-primary-600 text-white hover:bg-primary-700"
                          >
                            View Details
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Registration Number</p>
                            <p className="font-medium flex items-center">
                              <FileText size={14} className="mr-1 text-primary-600" />
                              {property.registrationNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Land Size</p>
                            <p className="font-medium">{property.landSize}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Last Updated</p>
                            <p className="font-medium flex items-center">
                              <Calendar size={14} className="mr-1 text-primary-600" />
                              {new Date(property.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === page 
                          ? 'bg-primary-600 text-white' 
                          : 'text-gray-700 hover:bg-primary-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;