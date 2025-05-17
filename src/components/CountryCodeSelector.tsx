import React, { useEffect, useState, useRef } from 'react';
import InputMask from 'react-input-mask';
import { fetchCountries, Country } from '../api/countries';
import { postTwoFactorAuth } from '../api/softpoint';

interface CountryCodeSelectorProps {}

export const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = () => {
  const [countries, setCountries] = useState<Record<string, Country> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phone, setPhone] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    async function loadCountries() {
      const data = await fetchCountries();
      setCountries(data);
      // select a default country
      if (data) {
        const defaultCountry = data['US'] || Object.values(data)[0];
        setSelectedCountry(defaultCountry);
      }
    }
    loadCountries();
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  if (!selectedCountry) return <div>Loading countries...</div>;

  function buildMask(phoneLength: number): string {
    if (phoneLength <= 10) {
      const part1 = phoneLength >= 3 ? '(999) ' : '(' + '9'.repeat(phoneLength);
      const part2Len = Math.min(phoneLength - 3, 3);
      const part2 = part2Len > 0 ? '999' : '';
      const part3Len = Math.max(phoneLength - 6, 0);
      const part3 = part3Len > 0 ? '-9999'.slice(0, part3Len + 1) : '';
      return `${part1}${part2}${part3}`;
    }
    return '9'.repeat(phoneLength);
  }

  const mask = buildMask(Number(selectedCountry.phone_length));

  // Display flag by country id using regional indicator symbols 
  function countryCodeToFlagEmoji(countryCode: string): string {
    if (!countryCode) return '';
    return countryCode
      .toUpperCase()
      .split('')
      .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      .join('');
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedCountry) {
      setSubmitResult('Please select a country first.');
      return;
    }

    // Basic validation: phone length must be correct number of digits ignoring formatting chars
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== Number(selectedCountry.phone_length)) {
      setSubmitResult(`Phone number must be exactly ${selectedCountry.phone_length} digits.`);
      return;
    }

    setLoading(true);
    setSubmitResult(null);

    try {
      const result = await postTwoFactorAuth(digitsOnly, selectedCountry.id);
      setSubmitResult('Two Factor Auth sent successfully.');
    } catch (error) {
      setSubmitResult('Failed to send Two Factor Auth.');
    } finally {
      setLoading(false);
    }
  }

  // Filtered countries list by search term
  const filteredCountries = countries
    ? Object.values(countries).filter((c) =>
        c.calling_code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div style={{ maxWidth: 500, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <div style={{ position: 'relative', marginBottom: 10 }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              cursor: 'pointer',
              padding: '5px 10px',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              background: '#fff',
              borderRadius: 4,
              width: '100%',
            }}
          >
            <span style={{ fontSize: 20, marginRight: 10 }}>
              {countryCodeToFlagEmoji(selectedCountry.id)}
            </span>
            <span>{selectedCountry.calling_code}</span>
            <span style={{ marginLeft: 'auto' }}>▼</span>
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                zIndex: 1000,
                background: 'white',
                border: '1px solid #ccc',
                width: '100%',
                maxHeight: 250,
                overflowY: 'auto',
                borderRadius: 4,
                marginTop: 2,
              }}
            >
              <input
                type="search"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '95%',
                  padding: 8,
                  margin: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                }}
              />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {filteredCountries.map((c) => (
                  <li
                    key={c.id}
                    onClick={() => {
                      setSelectedCountry(c);
                      setDropdownOpen(false);
                      setPhone('');
                    }}
                    style={{
                      padding: '8px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: c.id === selectedCountry.id ? '#eee' : 'white',
                    }}
                  >
                    <span style={{ fontSize: 20, marginRight: 10 }}>
                      {countryCodeToFlagEmoji(c.id)}
                    </span>
                    <span>{c.calling_code}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Phone input */}
        <InputMask
          mask={mask}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={mask.replace(/9/g, '0')}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
            marginBottom: 10,
          }}
        />
      </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 18,
            borderRadius: 4,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {submitResult && (
        <div
          style={{
            marginTop: 10,
            color: submitResult.includes('success') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {submitResult}
        </div>
      )}
    </div>
  );
};
