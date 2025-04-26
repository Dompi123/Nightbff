import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Step5DestinationScreen from '../step5-destination'; // Import the screen component
import useCreateGroupStore, { Destination } from '@/stores/createGroupStore'; // Import store & type

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Zustand store
const mockAddDestination = jest.fn();
const mockRemoveDestination = jest.fn();
// Define the state structure we need from the store
interface MockStoreState {
    destinations: Destination[];
    addDestination: jest.Mock;
    removeDestination: jest.Mock;
}
// Mock implementation function
const mockStoreImplementation = (destinationsList: Destination[] = []): MockStoreState => ({
    destinations: destinationsList,
    addDestination: mockAddDestination,
    removeDestination: mockRemoveDestination,
});
// Set up the initial mock
jest.mock('@/stores/createGroupStore', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockStoreImplementation()), // Start with empty destinations
}));

describe('<Step5DestinationScreen /> (Create Group Step 5)', () => {

  beforeEach(() => {
    // Clear mocks
    mockPush.mockClear();
    mockAddDestination.mockClear();
    mockRemoveDestination.mockClear();
    // Reset the mock store return value to default (empty destinations)
    (useCreateGroupStore as jest.Mock).mockReturnValue(mockStoreImplementation());
  });

  it('renders initial state correctly', () => {
    render(<Step5DestinationScreen />);

    // Assert initial elements
    expect(screen.getByText('Destinations')).toBeTruthy();
    expect(screen.getByText(/You can add up to \d+ destinations/i)).toBeTruthy(); // Check subtitle pattern
    expect(screen.getByText('Add Destination')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();

    // Assert that no destination items are rendered initially
    // Check for the specific placeholder text when the list is empty
    expect(screen.getByText('No destinations added yet.')).toBeTruthy();
  });

  it('opens destination selection modal on Add Destination press', () => {
    render(<Step5DestinationScreen />);
    
    const addButton = screen.getByText('Add Destination');
    fireEvent.press(addButton);

    // Assert that the router.push mock was called with the correct modal path
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/createGroup/add-destination-modal');
  });

  it('renders added destinations and calls removeDestination on remove press', () => {
    // Define sample destination data
    const sampleDestinations: Destination[] = [
        { id: 'p1', name: 'Prague', country: 'Czechia', flag: '🇨🇿' },
        { id: 'b1', name: 'Berlin', country: 'Germany', flag: '🇩🇪' },
    ];

    // Provide state with sample destinations for this test
    (useCreateGroupStore as jest.Mock).mockReturnValue(mockStoreImplementation(sampleDestinations));

    render(<Step5DestinationScreen />);

    // Assert the sample destinations are visible
    expect(screen.getByText('Prague')).toBeTruthy();
    expect(screen.getByText('Czechia')).toBeTruthy();
    expect(screen.getByText('Berlin')).toBeTruthy();
    expect(screen.getByText('Germany')).toBeTruthy();

    // Assert the empty list placeholder is NOT visible
    expect(screen.queryByText('No destinations added yet.')).toBeNull();

    // Find the 'X' button associated with Prague
    // We need a reliable way to select it. Assuming a testID pattern like `remove-destination-${id}` 
    // would be added to the TouchableOpacity in the actual component.
    const removePragueButton = screen.getByTestId('remove-destination-p1'); 
    // const removePragueButton = screen.getAllByRole('button')[index]; // Less reliable
    
    fireEvent.press(removePragueButton);

    // Assert mockRemoveDestination was called with the correct destination ID
    expect(mockRemoveDestination).toHaveBeenCalledTimes(1);
    expect(mockRemoveDestination).toHaveBeenCalledWith('p1');
  });

}); 