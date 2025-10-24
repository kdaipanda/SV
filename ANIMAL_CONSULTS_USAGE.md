# Animal Consultation Forms - Usage Guide

## Overview
This feature adds species-specific consultation forms for veterinary animal consultations. The forms are modular, lightweight, and designed to capture clinical information specific to each species.

## Files Added/Modified

### New Components
- `frontend/src/components/AnimalConsultForm.jsx` - Main wrapper component
- `frontend/src/components/species/HamsterForm.jsx` - Hamster consultation form
- `frontend/src/components/species/CanineFelineForm.jsx` - Canine/Feline consultation form
- `frontend/src/components/species/RabbitForm.jsx` - Rabbit consultation form
- `frontend/src/components/species/IguanaForm.jsx` - Iguana consultation form
- `frontend/src/components/species/BirdForm.jsx` - Bird (pet) consultation form
- `frontend/src/components/species/PoultryForm.jsx` - Poultry consultation form

### New Page
- `frontend/src/pages/NuevaConsultaAnimal.jsx` - Page component for animal consultations

### Modified Files
- `frontend/src/App.js` - Added route for 'nueva-consulta-animal' view

## Features

### Species Selection
The `AnimalConsultForm` component provides a dropdown to select the animal species. It attempts to load species from `/api/species` endpoint, but falls back to a default list if the API is unavailable.

### Species-Specific Forms
Each species has a dedicated form with relevant clinical fields:

1. **HamsterForm**: Basic identification, anamnesis, clinical exam
2. **CanineFelineForm**: Comprehensive fields for dogs and cats including vaccination, deworming, etc.
3. **RabbitForm**: Includes dental care, habitat, and diet specifics
4. **IguanaForm**: Reptile-specific fields including temperature, humidity, and UV lighting
5. **BirdForm**: Avian-specific exam including plumage, beak, and respiratory system
6. **PoultryForm**: Production animal focus with flock management considerations

### Form Structure
All forms include:
- **Section I**: Patient Identification (name, species, age, weight, sex, owner)
- **Section III**: Consultation Reason
- **Section IV**: Anamnesis (diet, habitat, behavior, medical history)
- **Section V**: Clinical Examination (vitals, body condition, system-specific findings)
- **Photos**: Comma-separated URLs that are normalized to arrays
- **Additional Observations**

### Data Submission
- Forms use `react-hook-form` for validation and form management
- Data is submitted via `axios` POST to `/api/animal-consults`
- Photo URLs are automatically converted from comma-separated strings to arrays
- Species identifier is included in the submission

## Backend Dependency

**Important**: These forms require a backend endpoint to function:

### Required Endpoint
- **POST** `/api/animal-consults`
  - Accepts JSON with consultation data
  - Should return success response with consultation ID

### Optional Endpoint
- **GET** `/api/species`
  - Returns list of available species
  - Format: `[{ id: 'species_id', name: 'Species Name' }, ...]`
  - If not available, component uses default species list

## Testing Steps

### 1. Access the Page
Navigate to the nueva-consulta-animal view by:
- Clicking a link/button that calls `setView('nueva-consulta-animal')`
- Or using URL parameter: `?view=nueva-consulta-animal`

### 2. Select Species
Choose a species from the dropdown menu

### 3. Fill Form
Complete the species-specific form fields

### 4. Submit
Click "Enviar Consulta" button

### 5. Verify
Check that:
- Success message appears on successful submission
- Error message appears if backend is unavailable
- Network request is sent to `/api/animal-consults` with correct data

## Manual Testing Checklist

- [ ] Page loads without errors
- [ ] Species dropdown displays all options
- [ ] Selecting different species shows different forms
- [ ] Form fields are appropriate for selected species
- [ ] Required field validation works
- [ ] Photo URL field accepts comma-separated values
- [ ] Submit button triggers API call
- [ ] Success/error messages display correctly
- [ ] Navigation back to dashboard works

## Development Notes

### Dependencies Used
- `react` (v19.0.0)
- `react-hook-form` (v7.56.2)
- `axios` (v1.8.4)

### Styling
Forms use Tailwind CSS classes matching the existing project style:
- `space-y-*` for vertical spacing
- `border`, `rounded`, `px-*`, `py-*` for inputs
- `bg-blue-600`, `text-white` for submit buttons
- `text-red-500` for error messages

### Environment Variables
Uses `process.env.REACT_APP_BACKEND_URL` for API base URL (defaults to empty string if not set)

## Future Enhancements

Potential improvements:
1. Add image upload functionality (currently only URLs)
2. Add form validation schemas with Zod
3. Add auto-save functionality
4. Add print/export consultation form
5. Add consultation templates
6. Implement offline mode with local storage
7. Add multi-language support

## Support

For issues or questions, refer to the main project documentation or contact the development team.
