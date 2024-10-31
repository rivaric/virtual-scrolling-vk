import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useFixedSizeList } from '../utils';

describe('useFixedSizeList', () => {
  const mockScrollElement = document.createElement('div');
  const getScrollElement = jest.fn(() => mockScrollElement);

  beforeEach(() => {
    mockScrollElement.scrollTop = 0;
    getScrollElement.mockClear();
  });

  it('should return correct initial values', () => {
    const { result } = renderHook(() =>
      useFixedSizeList({
        itemsCount: 100,
        itemHeight: 50,
        listHeight: 200,
        getScrollElement,
      }),
    );

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBeGreaterThan(0);
    expect(result.current.virtualItems).toHaveLength(
      result.current.endIndex + 1,
    );
    expect(result.current.totalHeight).toBe(5000);
  });

  it('should update virtual items list when scrollTop changes', () => {
    const { result } = renderHook(() =>
      useFixedSizeList({
        itemsCount: 100,
        itemHeight: 50,
        listHeight: 200,
        getScrollElement,
      }),
    );

    act(() => {
      mockScrollElement.scrollTop = 200;
      mockScrollElement.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.startIndex).toBeGreaterThan(0);
    expect(result.current.endIndex).toBeGreaterThan(result.current.startIndex);
  });

  it('should consider default overscan value and correctly update startIndex and endIndex', () => {
    const { result } = renderHook(() =>
      useFixedSizeList({
        itemsCount: 50,
        itemHeight: 50,
        listHeight: 200,
        getScrollElement,
        overscan: 2,
      }),
    );

    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBeGreaterThan(3);

    act(() => {
      mockScrollElement.scrollTop = 300;
      mockScrollElement.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.startIndex).toBeGreaterThan(0);
    expect(result.current.endIndex).toBeGreaterThan(result.current.startIndex);
  });
});
