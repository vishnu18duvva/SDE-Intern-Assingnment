import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  CircularProgress,
  Box,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { User, UserApiResponse } from '../types/user';

type SortField = 'first_name' | 'last_name' | 'email';
type SortOrder = 'asc' | 'desc';

const UserDirectory = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('first_name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [emailDomainFilter, setEmailDomainFilter] = useState('all');
  const [uniqueDomains, setUniqueDomains] = useState<string[]>([]);

  const rowsPerPage = 6;

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get<UserApiResponse>(
        `https://reqres.in/api/users?page=${pageNumber + 1}&per_page=${rowsPerPage}`
      );
      setUsers(response.data.data);
      setTotalUsers(response.data.total);
      
      // Extract unique email domains
      const domains = [...new Set(response.data.data.map(user => 
        user.email.split('@')[1]
      ))];
      setUniqueDomains(domains);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      
      const matchesDomain = emailDomainFilter === 'all' || 
        user.email.endsWith(emailDomainFilter);
      
      return matchesSearch && matchesDomain;
    })
    .sort((a, b) => {
      let compareValue = 0;
      if (sortField === 'email') {
        compareValue = a.email.localeCompare(b.email);
      } else if (sortField === 'first_name') {
        compareValue = a.first_name.localeCompare(b.first_name);
      } else if (sortField === 'last_name') {
        compareValue = a.last_name.localeCompare(b.last_name);
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search users"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Email Domain</InputLabel>
          <Select
            value={emailDomainFilter}
            label="Email Domain"
            onChange={(e) => setEmailDomainFilter(e.target.value)}
          >
            <MenuItem value="all">All Domains</MenuItem>
            {uniqueDomains.map(domain => (
              <MenuItem key={domain} value={domain}>{domain}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'first_name'}
                      direction={sortField === 'first_name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('first_name')}
                    >
                      First Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'last_name'}
                      direction={sortField === 'last_name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('last_name')}
                    >
                      Last Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'email'}
                      direction={sortField === 'email' ? sortOrder : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <img
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[rowsPerPage]}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default UserDirectory;