import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Step4DateScreen from '../step4-date'; // Import the screen component
import useCreateGroupStore from '@/stores/createGroupStore'; // Import store for mock type

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock @react-native-community/datetimepicker
// A simple mock that renders nothing by default, 
// allowing us to check if the component tries to render it conditionally.
// For interaction tests later, we might enhance this mock.
jest.mock('@react-native-community/datetimepicker', () => {
    const MockDateTimePicker = (props: any) => {
        // Render null or a simple placeholder identifiable in tests if needed
        return null; 
        // Example alternative: return <Text>MockPickerVisible</Text>;
    }
    return MockDateTimePicker; // Export the mock component directly
});

// Mock the Zustand store
const mockSetArrivalDate = jest.fn();
const mockSetDepartingDate = jest.fn();
jest.mock('@/stores/createGroupStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    arrivalDate: null,
    departingDate: null,
    setArrivalDate: mockSetArrivalDate,
    setDepartingDate: mockSetDepartingDate,
  })),
}));

describe('<Step4DateScreen /> (Create Group Step 4)', () => {

  beforeEach(() => {
    // Clear mocks before each test
    mockSetArrivalDate.mockClear();
    mockSetDepartingDate.mockClear();
    mockPush.mockClear();
    // Reset the mock store return value
    (useCreateGroupStore as unknown as jest.Mock).mockReturnValue({
      arrivalDate: null,
      departingDate: null,
      setArrivalDate: mockSetArrivalDate,
      setDepartingDate: mockSetDepartingDate,
    });
  });

  it('renders initial elements correctly', () => {
    render(<Step4DateScreen />);

    // Assert main elements are present
    expect(screen.getByText('Date')).toBeTruthy();
    expect(screen.getByText('When is the trip date?')).toBeTruthy();
    // The TouchableOpacity likely contains the placeholder text
    expect(screen.getByText('Arrival Date')).toBeTruthy(); 
    expect(screen.getByText('Departing Date')).toBeTruthy();
    expect(screen.getByText('Continue')).toBeTruthy();

    // Verify the mock DateTimePicker is NOT initially rendered
    // (Depends on how the mock is implemented - if it renders null, queryBy should work)
    // If mock rendered text: expect(screen.queryByText('MockPickerVisible')).toBeNull();
  });

  it('attempts to show picker on Arrival Date press', () => {
     render(<Step4DateScreen />);
     const arrivalButton = screen.getByText('Arrival Date');
     fireEvent.press(arrivalButton);
     // Basic check: Ensure pressing doesn't crash. 
     // Verifying the picker *appears* requires the mock to render something 
     // and checking for that element.
     // Example if mock rendered text: expect(screen.getByText('MockPickerVisible')).toBeTruthy();
     // For now, we just ensure the press happens without error.
     expect(screen.getByText('Arrival Date')).toBeTruthy(); // Re-assert element still exists
  });

   it('attempts to show picker on Departing Date press (after arrival is set)', () => {
      // Set mock state to have an arrival date first
      const fakeArrivalDate = new Date();
      (useCreateGroupStore as unknown as jest.Mock).mockReturnValue({
          arrivalDate: fakeArrivalDate,
          departingDate: null,
          setArrivalDate: mockSetArrivalDate,
          setDepartingDate: mockSetDepartingDate,
      });

     render(<Step4DateScreen />);
     const departingButton = screen.getByText('Departing Date');
     fireEvent.press(departingButton);
     // Basic check: Ensure pressing doesn't crash.
     expect(screen.getByText('Departing Date')).toBeTruthy(); 
  });

}); 