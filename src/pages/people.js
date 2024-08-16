import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosArrowRoundDown } from "react-icons/io";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { GoPencil } from "react-icons/go";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TbReload } from "react-icons/tb";
import { RiDeleteBinLine } from "react-icons/ri";
import { useRouter } from 'next/router'; 

import { useReactTable, flexRender, getCoreRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { faker } from '@faker-js/faker';
import Layout from '../components/Layout';
import FilterMenu from '../components/FilterMenu';
import DetailedInfo from '@/components/DetailedInfo';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  team: z.string().min(1, 'Team is required'),
  email: z.string().email('Invalid email'),
  status: z.string().min(1, 'Status is required'),
  teams: z.string().min(1, 'Teams are required'),
});


const generateData = () => {
  return Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
    status: faker.helpers.arrayElement(['Active', 'Inactive']),
    role: faker.person.jobTitle(),
    email: faker.internet.email(),
    teams: faker.helpers.arrayElements(['Design', 'Product', 'Marketing', 'Finance'], 4),
    username: faker.internet.userName(),
  }));
};

const PeoplePage = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);  
  const [sorting, setSorting] = useState([]);  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);  
  const [rowToDelete, setRowToDelete] = useState(null);  
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  
  const handleEdit = (rowData, event) => {
    event.stopPropagation();
    
    setValue('name', rowData.name);
    setValue('email', rowData.email);
    setValue('role', rowData.role);
    setValue('status', rowData.status);
    setValue('team', rowData.team);
    setValue('teams', rowData.teams.join(', '));
    setValue('image', rowData.image)
    setEditDialogOpen(true);
  };

  const handleDelete = (rowData, event) => {
    event.stopPropagation();
    setRowToDelete(rowData);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setData(data.filter(row => row.id !== rowToDelete.id));
    setShowDeleteDialog(false);
    setRowToDelete(null);
  };

  const handleRowClick = (rowData) => {
    if (!editMode) {
      setSelectedRow(rowData);
    }
  };

  useEffect(() => {
    const generatedData = generateData();
    setData(generatedData);
    setFilteredData(generatedData);

   
    const query = router.query.query;
    if (query) {
      setSearchTerm(query);
      const filteredResults = generatedData.filter(row =>
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.email.toLowerCase().includes(query.toLowerCase()) ||
        row.role.toLowerCase().includes(query.toLowerCase()) ||
        row.status.toLowerCase().includes(query.toLowerCase()) ||
        row.teams.some(team => team.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredData(filteredResults);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    
    router.push({
      pathname: '/people',
      query: { query: searchTerm },
    });
    
    const filteredResults = data.filter(row =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.teams.some(team => team.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(filteredResults);
  };
  const columns = [
    { 
      header: () => (
        <div className="flex items-center mx-5 cursor-pointer" onClick={() => handleSorting('name')}>
          <span className="text-sm">Name</span>
          <IoIosArrowRoundDown className="ml-2" />
        </div>
      ), 
      accessorKey: 'name', 
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center">
            <img src={row.original.image} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
            <div className="flex flex-col">
              <span>{row.original.name}</span>
              <span className="text-gray-500">@{row.original.username}</span>
            </div>
          </div>
        </div>
      ),
      enableSorting: true,
    },
    {
      header: () => (
        <div className="flex items-center mx-5 cursor-pointer" onClick={() => handleSorting('status')}>
          <span>Status</span>
          <IoIosArrowRoundDown className="ml-2" />
        </div>
      ), 
      accessorKey: 'status',
      cell: ({ row }) => (
        <button className="flex items-center px-1 text-sm py-1 rounded-lg text-black border">
          <span
            className={`h-2 w-2 rounded-full mr-2 ${
              row.original.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></span>
          {row.original.status}
        </button>
      ),
      enableSorting: true,
    },
    {
      header: () => (
        <div className="flex items-center mx-5">
          <span>Role</span>
          <HiOutlineQuestionMarkCircle className="ml-2" />
        </div>
      ), 
      accessorKey: 'role',
    },
    {
      header: () => (
        <div className="flex items-center mx-5">
          <span>Email address</span>
        </div>
      ),
      accessorKey: 'email',
    },
    { 
      header: 'Teams', 
      accessorKey: 'teams', 
      cell: ({ row }) => {
        const teams = row.original.teams;
        if (Array.isArray(teams)) { 
          const displayedTeams = teams.slice(0, 3);
          const remainingCount = teams.length > 3 ? ` +${teams.length - 3}` : '';
    
          const getTeamStyles = (team) => {
            switch (team) {
              case 'Design':
                return 'bg-purple-50 text-purple-700';
              case 'Product':
                return 'bg-blue-50 text-blue-700';
              case 'Marketing':
                return 'bg-blue-50 text-blue-800';
              default:
                return 'bg-purple-100 text-purple-700';
            }
          };
    
          return (
            <div className="flex gap-1 text-sm">
              {displayedTeams.map((team, index) => (
                <span 
                  key={index} 
                  className={`py-1 px-2 rounded-3xl ${getTeamStyles(team)}`}
                >
                  {team}
                </span>
              ))}
              {remainingCount && (
                <span className="py-1 px-2 bg-gray-300 rounded-3xl text-gray-700">
                  {remainingCount}
                </span>
              )}
            </div>
          );
        }
        return <span>{teams}</span>; 
      },
    },
    {
      header: ' ',
      cell: ({ row }) => (
        <div className="flex space-x-4 mr-4">
          <button 
            className="flex items-center justify-center text-black"
            onClick={(event) => handleDelete(row.original, event)}  
          >
            <MdOutlineDeleteOutline size={20} />
          </button>
          <button 
            className="flex items-center justify-center text-black"
            onClick={(event) => handleEdit(row.original, event)}  
          >
            <GoPencil size={20} />
          </button>
        </div>
      ),
    },
  ];


 const handleSorting = (columnId) => {
  setSorting(prev => {
    const existingSort = prev.find(sort => sort.id === columnId);
    if (existingSort) {
      const newDirection = existingSort.desc ? 'asc' : 'desc';
      return [{ id: columnId, desc: newDirection === 'desc' }];
    } else {
      return [{ id: columnId, desc: false }];
    }
  });
};



const sortedData = [...filteredData].sort((a, b) => {
  for (const sort of sorting) {
    const { id, desc } = sort;
    const aValue = a[id];
    const bValue = b[id];
    if (aValue < bValue) return desc ? 1 : -1;
    if (aValue > bValue) return desc ? -1 : 1;
  }
  return 0;
});

const paginatedData = sortedData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

const table = useReactTable({
  data: paginatedData,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    pagination: { pageIndex, pageSize },
    sorting,
  },
  onSortingChange: setSorting,
  manualPagination: true,
});


const onSubmit = (formData) => {
  console.log(formData);

  setEditDialogOpen(false);
};

const paginationNumbers = Array.from({ length: Math.ceil(data.length / pageSize) }, (_, i) => i + 1);

  return (
    <Layout>
      <div className="flex px-4 my-4 justify-between items-center border-b border-gray-300">
        <div className="flex items-center mb-1">
          <h1 className="text-xl mb-4">Team Members</h1>
          <p className="text-purple-600 border border-gray-500 rounded-2xl mx-6 px-2 bg-purple-50 my-4 -mt-1">100 users</p>
        </div>

        <div className="flex items-center space-x-4 -mt-6">
          <div className="relative">
            <input 
              type="search" 
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange} 
              className="border px-4 py-1 border-gray-400 rounded w-[300px]" 
            />
            <button  onClick={handleSearch} className="absolute right-0 top-0 mt-1 mr-2 text-purple-500 font-bold py-1 px-3 rounded">🔍</button>
          </div>
          <FilterMenu /> 

         

          <p className="font-medium bg-purple-700 cursor-pointer mx-2 rounded-lg text-white px-3 py-2 my-1"><span className="space-x-3 mx-2 ">
            +</span>ADD MEMBER</p>
        </div>
      </div>

      {editMode && selectedRow && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <Controller
            name="name"
            control={control}
            defaultValue={selectedRow.name}
            render={({ field }) => <input {...field} placeholder="Name" className="border p-2 mb-2" />}
          />
          <Controller
            name="role"
            control={control}
            defaultValue={selectedRow.role}
            render={({ field }) => <input {...field} placeholder="Role" className="border p-2 mb-2" />}
          />
          <Controller
            name="team"
            control={control}
            defaultValue={selectedRow.team}
            render={({ field }) => <input {...field} placeholder="Team" className="border p-2 mb-2" />}
          />
          <button type="submit" className="ml-2 bg-purple-600 text-white p-2">Save</button>
        </form>
      )}

      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="py-2 px-4 text-left bg-gray-100 border-b">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
  {table.getRowModel().rows.map(row => (
    <tr 
      key={row.id} 
      onClick={() => handleRowClick(row.original)}  
      className="cursor-pointer hover:bg-gray-100 border-b"
    >
      {row.getVisibleCells().map(cell => (
        <td key={cell.id} className="py-6 px-4 text-sm text-gray-700">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  ))}
</tbody>

      </table>

      <div className="flex justify-between items-center mt-4 my-2">
        <button 
          onClick={() => setPageIndex(Math.max(0, pageIndex - 1))} 
          disabled={pageIndex === 0}
          className={`mx-2 rounded-lg border-2 px-4 py-2 ${pageIndex === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          ← Previous
        </button>

        <div className="flex space-x-2">
          {paginationNumbers.map((number, index) => (
            <button 
              key={index}
              onClick={() => setPageIndex(number - 1)}
              className={`px-4 rounded-lg py-2 ${pageIndex === number - 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              {number}
            </button>
          ))}
          {paginationNumbers.length > 5 && (
            <>
              <span>...</span>
              <button 
                onClick={() => setPageIndex(paginationNumbers.length - 1)}
                className={`px-4 py-2 ${pageIndex === paginationNumbers.length - 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
              >
                {paginationNumbers.length}
              </button>
            </>
          )}
        </div>

        <button 
          onClick={() => setPageIndex(Math.min(paginationNumbers.length - 1, pageIndex + 1))} 
          disabled={pageIndex === paginationNumbers.length - 1}
          className={`mx-2 rounded-lg border-2 px-4 py-2 ${pageIndex === paginationNumbers.length - 1 ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Next →
        </button>
      </div>
  
      <DetailedInfo 
        user={selectedRow} 
        onClose={() => setSelectedRow(null)} 
      />

{editDialogOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center  justify-center  ">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <img src={selectedRow?.image} alt="Profile" className="w-20 h-20 rounded-full mb-4" />

              <div className="flex space-x-1 mx-10 -mt-4 mb-4 text-center justify-center"> <div className="border py-1 rounded-lg border-gray-600 mx-3 flex text-center items-center">
              <TbReload/>
                <button className="text-sm mx-3  ">CHANGE PHOTO</button>
                </div>
                <div className="border rounded-lg border-gray-600 flex text-center items-center">
                <RiDeleteBinLine/>
                <button className="text-sm mx-2 px-1  ">REMOVE PHOTO</button>
                </div>
                </div>

                <div className="w-1/2 flex">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                     <div className="flex flex-col">
                    <label>Name</label>
                    <input
                      {...field}
                      className="border px-6 py-2 rounded w-[300px] "
                      placeholder="Name"
                    />
                    </div>
                    </>
                  )}
                />
            
             
                        <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <>
                    <div className="flex flex-col ml-[20%]">
                    <label>Email</label>
                    <input
                      {...field}
                      className="border px-6 py-2 rounded w-[300px] "
                      placeholder="Email"
                    />
                    </div>
                    </>
                  )}
                />
        
              
              </div>
         
              <div className="w-1/2 flex">
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <>
                     <div className="flex flex-col">
                    <label>Role</label>
                    <input
                      {...field}
                      className="border px-6 py-2 rounded w-[300px] "
                      placeholder="Role"
                    />
                    </div>
                    </>
                  )}
                />
            
             
                        <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <>
                    <div className="flex flex-col ml-[20%]">
                    <label>Status</label>
                    <input
                      {...field}
                      className="border px-6 py-2 rounded w-[300px] "
                      placeholder="Status"
                    />
                    </div>
                    </>
                  )}
                />
        
              
              </div>
              <div className="mb-4">
                <Controller
                  name="teams"
                  control={control}
                  render={({ field }) => (
                    <>
                    <label>Teams</label>
                    <input
                      {...field}
                      className="border px-4 py-2 rounded w-full"
                      placeholder="Teams"
                    />
                    </>
                  )}
                />
              
              </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Delete Member Details</h2>
              <button onClick={() => setShowDeleteDialog(false)} className="text-gray-500">&times;</button>
            </div>
            <p className="mt-4">Are you sure you want to delete this member details? This action cannot be undone.</p>
            <div className="flex justify-end mt-6 space-x-4">
              <button 
                onClick={confirmDelete} 
                className="bg-purple-500 text-white px-4 py-2 rounded-lg"
              >
                DELETE
              </button>
            
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PeoplePage;
