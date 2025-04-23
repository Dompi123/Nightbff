import { create } from 'zustand';

// Define Destination type/interface
interface Destination {
  id: string; // Unique ID
  name: string;
  country: string;
  flag: string; // Emoji
}

interface CreateGroupState {
  groupName: string;
  groupImageUri: string | null;
  aboutTrip: string;
  arrivalDate: Date | null;
  departingDate: Date | null;
  destinations: Destination[];
  interests: string[];
  link: string;
  visibility: 'public' | 'private';

  // Actions
  setGroupName: (name: string) => void;
  setGroupImageUri: (uri: string | null) => void;
  setAboutTrip: (about: string) => void;
  setArrivalDate: (date: Date | null) => void;
  setDepartingDate: (date: Date | null) => void;
  addDestination: (destination: Destination) => void;
  removeDestination: (id: string) => void;
  toggleInterest: (interestId: string) => void;
  setLink: (link: string) => void;
  setVisibility: (visibility: 'public' | 'private') => void;
  resetState: () => void;
}

const MAX_INTERESTS_STORE = 5; // Define limit inside store file

const initialState = {
  groupName: '',
  groupImageUri: null,
  aboutTrip: '',
  arrivalDate: null,
  departingDate: null,
  destinations: [],
  interests: [],
  link: '',
  visibility: 'public' as 'public' | 'private',
};

const useCreateGroupStore = create<CreateGroupState>()((set) => ({
  ...initialState,

  // Actions Implementation
  setGroupName: (name) => set({ groupName: name }),
  setGroupImageUri: (uri) => set({ groupImageUri: uri }),
  setAboutTrip: (about) => set({ aboutTrip: about }),
  setArrivalDate: (date) => set({ arrivalDate: date }),
  setDepartingDate: (date) => set({ departingDate: date }),
  addDestination: (destination) =>
    set((state) => ({
      destinations: [...state.destinations, destination],
    })),
  removeDestination: (id) =>
    set((state) => ({
      destinations: state.destinations.filter((d) => d.id !== id),
    })),
  toggleInterest: (interestId) =>
    set((state) => {
      const interests = state.interests;
      const isSelected = interests.includes(interestId);
      if (isSelected) {
        // Remove if already selected
        return { interests: interests.filter((id) => id !== interestId) };
      } else {
        // Add if not selected and under limit
        if (interests.length < MAX_INTERESTS_STORE) {
          return { interests: [...interests, interestId] };
        } else {
          console.warn(`Maximum interests (${MAX_INTERESTS_STORE}) reached`); // Or show alert
          return {}; // No change if limit reached
        }
      }
    }),
  setLink: (link) => set({ link: link }),
  setVisibility: (visibility) => set({ visibility: visibility }),
  resetState: () => set(initialState),
}));

export default useCreateGroupStore; 