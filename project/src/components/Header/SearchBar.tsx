import { Search, Mic, Loader2, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { allProducts, SearchProduct } from '../../data/allProducts';

// Helper to get description keywords for searching product descriptions
const getProductDescriptionKeywords = (p: SearchProduct): string => {
  if (p.mainCategory.toLowerCase() === 'eco') {
    return 'eco-friendly sustainable biodegradable plastic-free natural materials organic zero waste';
  }
  if (p.mainCategory.toLowerCase() === 'wellness') {
    return 'wellness healthy organic ingredients therapeutic natural healing relaxation self care';
  }
  if (p.mainCategory.toLowerCase() === 'food') {
    return 'organic food hand-processed traditional recipe healthy grains pure ingredients nutritional';
  }
  if (p.mainCategory.toLowerCase() === 'craft') {
    return 'handcrafted rural artisans traditional art heritage home decor eco-friendly crafts';
  }
  if (p.mainCategory.toLowerCase() === 'fashion') {
    return 'natural fiber organic cotton hand-spun handloom fabric sustainable fashion breathable';
  }
  if (p.mainCategory.toLowerCase() === 'decor items' || p.mainCategory.toLowerCase() === 'decor') {
    return 'handcrafted home decor wall hanging candle holder elegant aesthetic artistic ornaments';
  }
  return '';
};

// Map website language to SpeechRecognition locale
const speechLocales: Record<string, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up SpeechRecognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setQuery('');
    setIsDropdownOpen(false);
  };

  // Perform search matching
  const filteredProducts: SearchProduct[] = query.trim() === '' 
    ? [] 
    : allProducts.filter(p => {
        const lowerQuery = query.toLowerCase();
        const descKeywords = getProductDescriptionKeywords(p);
        return (
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) || // Subcategory
          p.mainCategory.toLowerCase().includes(lowerQuery) || // Category
          descKeywords.toLowerCase().includes(lowerQuery) // Description
        );
      });

  // Start Voice Speech Recognition
  const toggleVoiceSearch = () => {
    // Check if active and stop it
    if (voiceState === 'listening') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setVoiceState('idle');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(t('voiceSearch.errUnsupported'));
      setVoiceState('error');
      setTimeout(() => {
        setVoiceState('idle');
        setVoiceError(null);
      }, 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;

      // Match recognition language with currently selected site language
      const currentLang = i18n.resolvedLanguage || i18n.language || 'en';
      recognition.lang = speechLocales[currentLang] || 'en-IN';

      recognition.onstart = () => {
        setVoiceState('listening');
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        setVoiceState('processing');
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          setIsDropdownOpen(true);
          setVoiceState('idle');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        let errorMsg = t('voiceSearch.errNoSpeech');
        if (event.error === 'not-allowed') {
          errorMsg = t('voiceSearch.errPermission');
        } else if (event.error === 'no-speech') {
          errorMsg = t('voiceSearch.errNoSpeech');
        } else if (event.error === 'service-not-allowed' || event.error === 'network') {
          errorMsg = t('voiceSearch.errMicUnavailable');
        }

        setVoiceError(errorMsg);
        setVoiceState('error');
        setTimeout(() => {
          setVoiceState('idle');
          setVoiceError(null);
        }, 4000);
      };

      recognition.onend = () => {
        // If ended and didn't result in processing/error, return to idle
        setVoiceState(prev => prev === 'listening' ? 'idle' : prev);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setVoiceError(t('voiceSearch.errMicUnavailable'));
      setVoiceState('error');
      setTimeout(() => {
        setVoiceState('idle');
        setVoiceError(null);
      }, 4000);
    }
  };

  return (
    <div className="flex-1 max-w-2xl relative" ref={dropdownRef}>
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0 mr-2" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() !== '') setIsDropdownOpen(true);
          }}
          placeholder={t('search.placeholder')}
          className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
        />
        
        {/* Voice Search Microphone Button */}
        <button 
          onClick={toggleVoiceSearch}
          className={`relative flex-shrink-0 ml-2 p-1.5 rounded-full transition-all duration-300 ${
            voiceState === 'listening' 
              ? 'bg-red-50 text-red-600 scale-110 shadow-md ring-4 ring-red-100' 
              : voiceState === 'processing'
              ? 'bg-yellow-50 text-yellow-600'
              : 'text-gray-400 hover:text-green-600 hover:bg-gray-50'
          }`}
          title="Voice Search"
        >
          {voiceState === 'processing' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mic className="w-4 h-4" />
          )}

          {/* Pulsing Visual Effect for Listening */}
          {voiceState === 'listening' && (
            <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
          )}
        </button>
      </div>

      {/* Floating Status & Error Banner */}
      {(voiceState === 'listening' || voiceState === 'processing' || voiceState === 'error') && (
        <div className={`absolute top-full mt-2 w-full px-4 py-3 rounded-lg shadow-lg border text-sm z-50 flex items-center gap-2 transition-all ${
          voiceState === 'error' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          {voiceState === 'listening' && (
            <>
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse flex-shrink-0" />
              <span className="font-semibold">{t('voiceSearch.listening')}</span>
              <span className="text-xs text-green-700/80 bg-green-100/50 px-2 py-0.5 rounded-full border border-green-200 ml-auto">
                {speechLocales[i18n.resolvedLanguage || i18n.language || 'en'] || 'en-IN'}
              </span>
            </>
          )}
          {voiceState === 'processing' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-green-600 flex-shrink-0" />
              <span>{t('voiceSearch.processing')}</span>
            </>
          )}
          {voiceState === 'error' && (
            <>
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="font-medium">{voiceError}</span>
            </>
          )}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isDropdownOpen && query.trim() !== '' && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          {filteredProducts.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <li 
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 flex gap-2">
                      <span>{product.mainCategory}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    &#8377;{product.price}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              {t('search.noResults')} "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
