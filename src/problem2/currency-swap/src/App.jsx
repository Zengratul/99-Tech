import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, Avatar, Alert, Stack } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const TOKEN_ICON_URL = symbol => `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol.toUpperCase()}.svg`;

const parseTokenData = (data) => {
  let tokens = [];
  let pricesObj = {};
  if (Array.isArray(data)) {
    tokens = data.filter(
      v => v.currency && !isNaN(Number(v.price)) && Number(v.price) > 0
    ).map(v => ({
      symbol: v.currency,
      name: v.currency,
      price: Number(v.price),
    }));
    data.forEach(v => {
      if (v.currency) pricesObj[v.currency] = v;
    });
  } else if (typeof data === 'object' && data !== null) {
    tokens = Object.entries(data).filter(
      ([, v]) => v.currency && !isNaN(Number(v.price)) && Number(v.price) > 0
    ).map(([, v]) => ({
      symbol: v.currency,
      name: v.currency,
      price: Number(v.price),
    }));
    pricesObj = data;
  }
  return { tokens, pricesObj };
};

const formatNumber = (num, decimals = 6) => {
  if (!num && num !== 0) return '';
  return parseFloat(num).toLocaleString(undefined, { maximumFractionDigits: decimals });
};

const App = () => {
  const [tokens, setTokens] = useState([]);
  const [prices, setPrices] = useState({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm({
    mode: 'onChange',
    defaultValues: { from: '', to: '', amount: '' }
  });

  const from = watch('from');
  const to = watch('to');
  const amount = watch('amount');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(PRICES_URL);
        const { tokens: tokensWithPrice, pricesObj } = parseTokenData(res.data);
        setTokens(tokensWithPrice);
        setPrices(pricesObj);
        if (tokensWithPrice.length > 1) {
          reset({ from: tokensWithPrice[0].symbol, to: tokensWithPrice[1].symbol, amount: '' });
        } else if (tokensWithPrice.length === 1) {
          reset({ from: tokensWithPrice[0].symbol, to: '', amount: '' });
        } else {
          setError('No tokens available.');
        }
      } catch {
        setError('Failed to fetch token prices.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!from || !to || !amount || isNaN(amount) || Number(amount) <= 0) {
      setOutput('');
      return;
    }
    if (!prices[from] || !prices[to]) {
      setOutput('');
      return;
    }
    const fromPrice = prices[from].price;
    const toPrice = prices[to].price;
    if (!fromPrice || !toPrice) {
      setOutput('');
      return;
    }
    const outputAmount = (Number(amount) * fromPrice) / toPrice;
    setOutput(outputAmount);
  }, [from, to, amount, prices]);

  const handleSwap = () => {
    setValue('from', to);
    setValue('to', from);
    setOutput('');
  };

  const onSubmit = () => {};

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ maxWidth: 600, width: '100%', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 2, sm: 4 } }}>
        <Typography variant="h3" fontWeight={700} align="center" mb={3} sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, background: 'none', color: '#222' }}>
          Currency Swap
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form autoComplete="off" style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ width: '100%' }}>
              <Stack spacing={2} flex={1} sx={{ width: '100%' }}>
                <FormControl fullWidth error={!!errors.from}>
                  <InputLabel id="from-label">From</InputLabel>
                  <Select
                    labelId="from-label"
                    label="From"
                    value={from || ''}
                    {...register('from', { required: 'Select a currency.' })}
                    onChange={e => setValue('from', e.target.value)}
                    renderValue={selected => {
                      const token = tokens.find(t => t.symbol === selected);
                      return token ? (
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={TOKEN_ICON_URL(token.symbol)}
                            sx={{ width: 20, height: 20 }}
                            onError={e => { e.target.onerror = null; e.target.src = ''; }}
                          >
                            <AccountBalanceWalletIcon fontSize="small" />
                          </Avatar>
                          <span>{token.name}</span>
                        </Stack>
                      ) : '';
                    }}
                  >
                    {tokens.map(token => (
                      <MenuItem key={token.symbol} value={token.symbol}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={TOKEN_ICON_URL(token.symbol)}
                            sx={{ width: 20, height: 20 }}
                            onError={e => { e.target.onerror = null; e.target.src = ''; }}
                          >
                            <AccountBalanceWalletIcon fontSize="small" />
                          </Avatar>
                          <span>{token.name}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.from && <span style={{ color: '#d32f2f', fontSize: 13, marginTop: 2 }}>{errors.from.message}</span>}
                </FormControl>
                <TextField
                  label="Amount to send"
                  value={amount || ''}
                  {...register('amount', {
                    required: 'Enter an amount.',
                    validate: value => !isNaN(value) && Number(value) > 0 || 'Enter a valid positive number.'
                  })}
                  onChange={e => setValue('amount', e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: from && (
                      <InputAdornment position="start">
                        <Avatar
                          src={TOKEN_ICON_URL(from)}
                          sx={{ width: 20, height: 20, mr: 1 }}
                          onError={e => { e.target.onerror = null; e.target.src = ''; }}
                        >
                          <AccountBalanceWalletIcon fontSize="small" />
                        </Avatar>
                      </InputAdornment>
                    )
                  }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message || ' '}
                  autoFocus
                />
              </Stack>
              <Stack spacing={2} flex={1} sx={{ width: '100%' }}>
                <FormControl fullWidth error={!!errors.to}>
                  <InputLabel id="to-label">To</InputLabel>
                  <Select
                    labelId="to-label"
                    label="To"
                    value={to || ''}
                    {...register('to', { required: 'Select a currency.' })}
                    onChange={e => setValue('to', e.target.value)}
                    renderValue={selected => {
                      const token = tokens.find(t => t.symbol === selected);
                      return token ? (
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={TOKEN_ICON_URL(token.symbol)}
                            sx={{ width: 20, height: 20 }}
                            onError={e => { e.target.onerror = null; e.target.src = ''; }}
                          >
                            <AccountBalanceWalletIcon fontSize="small" />
                          </Avatar>
                          <span>{token.name}</span>
                        </Stack>
                      ) : '';
                    }}
                  >
                    {tokens.filter(token => token.symbol !== from).map(token => (
                      <MenuItem key={token.symbol} value={token.symbol}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={TOKEN_ICON_URL(token.symbol)}
                            sx={{ width: 20, height: 20 }}
                            onError={e => { e.target.onerror = null; e.target.src = ''; }}
                          >
                            <AccountBalanceWalletIcon fontSize="small" />
                          </Avatar>
                          <span>{token.name}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.to && <span style={{ color: '#d32f2f', fontSize: 13, marginTop: 2 }}>{errors.to.message}</span>}
                </FormControl>
                <TextField
                  label="Amount to receive"
                  value={formatNumber(output)}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    startAdornment: to && (
                      <InputAdornment position="start">
                        <Avatar
                          src={TOKEN_ICON_URL(to)}
                          sx={{ width: 20, height: 20, mr: 1 }}
                          onError={e => { e.target.onerror = null; e.target.src = ''; }}
                        >
                          <AccountBalanceWalletIcon fontSize="small" />
                        </Avatar>
                      </InputAdornment>
                    )
                  }}
                />
                {(!output && from && to && amount && !loading) && (
                  <Alert severity="warning" sx={{ mt: 1 }}>Không thể quy đổi do thiếu dữ liệu giá.</Alert>
                )}
              </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3, width: '100%' }}>
              <Button variant="outlined" color="primary" onClick={handleSwap} fullWidth sx={{ fontSize: 20, flex: 1, minWidth: 0, px: 2 }} type="button">
                ⇅ Swap
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                type="submit"
                disabled={!!errors.amount || !!errors.from || !!errors.to || loading}
                sx={{ fontWeight: 700, fontSize: '1.1rem', py: 1.5, flex: 1 }}
              >
                CONFIRM SWAP
              </Button>
            </Stack>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default App;
