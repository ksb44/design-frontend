import { useState } from 'react';
import { CiFilter } from "react-icons/ci";
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

const FilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roles: [],
    teams: [],
  });

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleCategoryToggle = (category) => {
    if (category === 'roles') {
      setShowRoles(prev => !prev);
    } else if (category === 'teams') {
      setShowTeams(prev => !prev);
    }
  };

  const handleSelect = (category, item) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item],
    }));
  };

  const isSelected = (category, item) => {
    return selectedFilters[category].includes(item);
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="flex items-center space-x-2">
        <CiFilter className="h-10 w-8 text-center" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="p-4">
            <div className="flex justify-between pb-2 border-b mb-2">
              <span>Filters</span>
              <span onClick={handleToggle} className="cursor-pointer">˄</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <span 
                  className=" mb-2 cursor-pointer flex items-center" 
                  onClick={() => handleCategoryToggle('roles')}
                >
                  <input
                    type="checkbox"
                    className="mx-2"
                    checked={showRoles}
                    readOnly
                  />
                  Roles
                </span>
                <span className="-mt-2 cursor-pointer">
                  {showRoles ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </span>
              </div>
              {showRoles && (
                <div className="space-y-2 ml-8">
                  {['Frontend Developer', 'Backend Developer', 'Product Manager', 'Product Designer'].map(role => (
                    <div
                      key={role}
                      className={`flex items-center px-2 py-1 rounded cursor-pointer ${isSelected('roles', role) ? 'bg-purple-600 text-white' : ''}`}
                      onClick={() => handleSelect('roles', role)}
                    >
                      <input
                        type="checkbox"
                        id={`role-${role}`}
                        checked={isSelected('roles', role)}
                        onChange={() => handleSelect('roles', role)}
                        className="mr-2"
                      />
                      <label htmlFor={`role-${role}`}>{role}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <span 
                  className=" mb-2 cursor-pointer flex items-center" 
                  onClick={() => handleCategoryToggle('teams')}
                >
                  <input
                    type="checkbox"
                    className="mx-2"
                    checked={showTeams}
                    readOnly
                  />
                  Teams
                </span>
                <span className="-mt-2 cursor-pointer">
                  {showTeams ? <MdArrowDropUp /> : <MdArrowDropDown />}
                </span>
              </div>
              {showTeams && (
                <div className="space-y-2 ml-8">
                  {['Product', 'Marketing', 'Design', 'Technology'].map(team => (
                    <div
                      key={team}
                      className={`flex items-center px-2 py-1 rounded cursor-pointer ${isSelected('teams', team) ? 'bg-purple-600 text-white' : ''}`}
                      onClick={() => handleSelect('teams', team)}
                    >
                      <input
                        type="checkbox"
                        id={`team-${team}`}
                        checked={isSelected('teams', team)}
                        onChange={() => handleSelect('teams', team)}
                        className="mr-2"
                      />
                      <label htmlFor={`team-${team}`}>{team}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right">
              <button className="bg-purple-600 w-full text-white px-4 py-2 rounded">
                SELECT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
