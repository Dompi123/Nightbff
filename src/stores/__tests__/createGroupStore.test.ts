import useCreateGroupStore, { Destination } from '../createGroupStore'; // Adjust path as needed

// Define the expected initial state structure for comparison
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

const MAX_INTERESTS = 5;

describe('useCreateGroupStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    useCreateGroupStore.getState().resetState();
  });

  it('should initialize with the correct default state', () => {
    const state = useCreateGroupStore.getState();
    // Exclude functions (actions) from the state comparison
    const { resetState, setGroupName, setGroupImageUri, setAboutTrip, setArrivalDate, setDepartingDate, addDestination, removeDestination, toggleInterest, setLink, setVisibility, ...initialData } = state;
    expect(initialData).toEqual(initialState);
  });

  it('should update groupName using setGroupName', () => {
    const newName = 'Test Group';
    useCreateGroupStore.getState().setGroupName(newName);
    expect(useCreateGroupStore.getState().groupName).toBe(newName);
  });

  it('should update groupImageUri using setGroupImageUri', () => {
    const uri = 'https://example.com/image.jpg';
    useCreateGroupStore.getState().setGroupImageUri(uri);
    expect(useCreateGroupStore.getState().groupImageUri).toBe(uri);

    useCreateGroupStore.getState().setGroupImageUri(null);
    expect(useCreateGroupStore.getState().groupImageUri).toBeNull();
  });

  it('should update aboutTrip using setAboutTrip', () => {
    const about = 'This is a test trip description.';
    useCreateGroupStore.getState().setAboutTrip(about);
    expect(useCreateGroupStore.getState().aboutTrip).toBe(about);
  });

  it('should update arrivalDate using setArrivalDate', () => {
    const date = new Date(2025, 10, 15); // Nov 15, 2025
    useCreateGroupStore.getState().setArrivalDate(date);
    expect(useCreateGroupStore.getState().arrivalDate).toEqual(date);

    useCreateGroupStore.getState().setArrivalDate(null);
    expect(useCreateGroupStore.getState().arrivalDate).toBeNull();
  });

  it('should update departingDate using setDepartingDate', () => {
    const date = new Date(2025, 10, 20); // Nov 20, 2025
    useCreateGroupStore.getState().setDepartingDate(date);
    expect(useCreateGroupStore.getState().departingDate).toEqual(date);

    useCreateGroupStore.getState().setDepartingDate(null);
    expect(useCreateGroupStore.getState().departingDate).toBeNull();
  });

  describe('destinations actions', () => {
    const dest1: Destination = { id: 'd1', name: 'Paris', country: 'France', flag: '🇫🇷' };
    const dest2: Destination = { id: 'd2', name: 'Tokyo', country: 'Japan', flag: '🇯🇵' };

    it('should add destinations using addDestination', () => {
      useCreateGroupStore.getState().addDestination(dest1);
      expect(useCreateGroupStore.getState().destinations).toEqual([dest1]);

      useCreateGroupStore.getState().addDestination(dest2);
      expect(useCreateGroupStore.getState().destinations).toEqual([dest1, dest2]);
    });

    it('should remove destinations using removeDestination', () => {
      useCreateGroupStore.getState().addDestination(dest1);
      useCreateGroupStore.getState().addDestination(dest2);
      expect(useCreateGroupStore.getState().destinations).toEqual([dest1, dest2]);

      useCreateGroupStore.getState().removeDestination(dest1.id);
      expect(useCreateGroupStore.getState().destinations).toEqual([dest2]);

      useCreateGroupStore.getState().removeDestination(dest2.id);
      expect(useCreateGroupStore.getState().destinations).toEqual([]);
    });
  });

  describe('interests actions', () => {
    it('should add and remove interests using toggleInterest', () => {
      useCreateGroupStore.getState().toggleInterest('nightlife');
      expect(useCreateGroupStore.getState().interests).toEqual(['nightlife']);

      useCreateGroupStore.getState().toggleInterest('music');
      expect(useCreateGroupStore.getState().interests).toEqual(['nightlife', 'music']);

      useCreateGroupStore.getState().toggleInterest('nightlife'); // Toggle off
      expect(useCreateGroupStore.getState().interests).toEqual(['music']);
    });

    it('should enforce the interest limit', () => {
      const interestsToAdd = ['i1', 'i2', 'i3', 'i4', 'i5'];
      interestsToAdd.forEach(interest => {
        useCreateGroupStore.getState().toggleInterest(interest);
      });
      expect(useCreateGroupStore.getState().interests.length).toBe(MAX_INTERESTS);
      expect(useCreateGroupStore.getState().interests).toEqual(interestsToAdd);

      // Try adding a 6th interest
      useCreateGroupStore.getState().toggleInterest('i6');
      expect(useCreateGroupStore.getState().interests.length).toBe(MAX_INTERESTS);
      expect(useCreateGroupStore.getState().interests).toEqual(interestsToAdd); // Should remain unchanged

      // Should still be able to toggle off an existing interest
      useCreateGroupStore.getState().toggleInterest('i1');
      expect(useCreateGroupStore.getState().interests.length).toBe(MAX_INTERESTS - 1);
      expect(useCreateGroupStore.getState().interests).toEqual(['i2', 'i3', 'i4', 'i5']);
    });
  });

  it('should update link using setLink', () => {
    const newLink = 'https://my-trip-link.com';
    useCreateGroupStore.getState().setLink(newLink);
    expect(useCreateGroupStore.getState().link).toBe(newLink);
  });

  it('should update visibility using setVisibility', () => {
    useCreateGroupStore.getState().setVisibility('private');
    expect(useCreateGroupStore.getState().visibility).toBe('private');

    useCreateGroupStore.getState().setVisibility('public');
    expect(useCreateGroupStore.getState().visibility).toBe('public');
  });

  it('should reset the state to initial values using resetState', () => {
    // Modify some state values
    useCreateGroupStore.getState().setGroupName('Temporary Name');
    useCreateGroupStore.getState().setGroupImageUri('temp_uri');
    useCreateGroupStore.getState().addDestination({ id: 'temp_dest', name: 'Temp', country: 'Temp', flag: '🇹🇲' });
    useCreateGroupStore.getState().toggleInterest('temp_interest');
    useCreateGroupStore.getState().setVisibility('private');

    // Call reset
    useCreateGroupStore.getState().resetState();

    // Verify state matches initial state
    const state = useCreateGroupStore.getState();
    const { resetState, setGroupName, setGroupImageUri, setAboutTrip, setArrivalDate, setDepartingDate, addDestination, removeDestination, toggleInterest, setLink, setVisibility, ...currentData } = state;
    expect(currentData).toEqual(initialState);
  });
}); 