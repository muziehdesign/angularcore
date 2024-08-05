import { TruncatedCountPipe } from './truncated-count.pipe';

describe('TruncatedCountPipe', () => {
  it('displays original number', () => {
    const pipe = new TruncatedCountPipe();
    expect(pipe.transform(0, 99)).toEqual('0');
    expect(pipe.transform(98, 99)).toEqual('98');
  });
  it('truncates number to max', () => {
    const pipe = new TruncatedCountPipe();
    expect(pipe.transform(100, 99)).toEqual('99+');
    expect(pipe.transform(1000, 99)).toEqual('99+');
  });
});
