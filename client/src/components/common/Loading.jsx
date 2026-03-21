import { Spinner } from './Spinner.jsx'

export function Loading({ text = 'Loading...', size = 'md' }) {
  return <Spinner />
}

export function InlineLoading({ text = 'Loading...' }) {
  return <Spinner size={30} />
}
