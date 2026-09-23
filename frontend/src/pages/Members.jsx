import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  async function fetchMembers() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/members", {
        params: {
          page,
          limit,
          search: appliedSearch || undefined,
          status: status || undefined
        }
      });

      console.log(
        "MEMBERS RESPONSE:",
        response.data
      );

      const data = response.data?.data;

      let memberList = [];
      let paginationData = null;

      if (Array.isArray(data)) {
        memberList = data;
        paginationData = response.data?.pagination;
      } else if (
        data &&
        Array.isArray(data.members)
      ) {
        memberList = data.members;
        paginationData =
          data.pagination ||
          response.data?.pagination;
      }

      setMembers(memberList);

      setPagination(
        paginationData || {
          page,
          limit,
          total: memberList.length,
          totalPages:
            memberList.length > 0 ? 1 : 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      );
    } catch (error) {
      console.error(
        "MEMBERS ERROR:",
        error
      );

      setMembers([]);

      setError(
        error.response?.data?.message ||
          "Failed to load members."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [page, status, appliedSearch]);

  function handleSearch(e) {
    e.preventDefault();

    setPage(1);
    setAppliedSearch(search.trim());
  }

  function handleStatusChange(e) {
    setStatus(e.target.value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setAppliedSearch("");
    setStatus("");
    setPage(1);
  }

  const totalMembers = pagination.total || 0;

  const currentPageMembers = members.length;

  return (
    <div className="members-page">

      {/* =====================================
          TOP HERO
      ====================================== */}
      <section className="members-hero">

        <div className="members-hero-content">

          <span className="members-kicker">
            GYMIFY / MEMBER MANAGEMENT
          </span>

          <h1>
            BUILD YOUR
            <br />
            <span>COMMUNITY.</span>
          </h1>

          <p>
            Manage member profiles, status,
            contact information and gym activity
            from one powerful workspace.
          </p>

        </div>

        <div className="members-hero-decoration">

          <div className="hero-number">
            {String(totalMembers).padStart(2, "0")}
          </div>

          <span>
            TOTAL MEMBERS
          </span>

        </div>

      </section>


      {/* =====================================
          STATS
      ====================================== */}
      <section className="members-stats">

        <div className="member-stat-card">
          <span>
            TOTAL MEMBERS
          </span>

          <strong>
            {totalMembers}
          </strong>

          <small>
            Registered in Gymify
          </small>
        </div>


        <div className="member-stat-card">
          <span>
            CURRENT PAGE
          </span>

          <strong>
            {currentPageMembers}
          </strong>

          <small>
            Members displayed
          </small>
        </div>


        <div className="member-stat-card">
          <span>
            PAGE
          </span>

          <strong>
            {pagination.page || 1}
          </strong>

          <small>
            Of {pagination.totalPages || 1}
          </small>
        </div>


        <button
          className="member-add-card"
          onClick={() =>
            navigate("/members/add")
          }
        >
          <span>+</span>

          <div>
            <strong>
              ADD MEMBER
            </strong>

            <small>
              Register a new member
            </small>
          </div>
        </button>

      </section>


      {/* =====================================
          TOOLBAR
      ====================================== */}
      <section className="members-control-panel">

        <div className="control-heading">

          <div>
            <span>
              MEMBER DIRECTORY
            </span>

            <h2>
              All Members
            </h2>
          </div>

          <div className="directory-count">
            {totalMembers} RECORDS
          </div>

        </div>


        <div className="members-toolbar-modern">

          <form
            className="modern-search"
            onSubmit={handleSearch}
          >

            <span className="search-symbol">
              /
            </span>

            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setSearch("");
                  setAppliedSearch("");
                  setPage(1);
                }}
              >
                ×
              </button>
            )}

            <button
              type="submit"
              className="modern-search-button"
            >
              SEARCH
            </button>

          </form>


          <select
            value={status}
            onChange={handleStatusChange}
            className="modern-status-select"
          >
            <option value="">
              ALL STATUS
            </option>

            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>
          </select>


          {(appliedSearch || status) && (
            <button
              className="clear-filters-button"
              onClick={clearFilters}
            >
              CLEAR
            </button>
          )}

        </div>

      </section>


      {/* =====================================
          ERROR
      ====================================== */}
      {error && (
        <div className="members-error">

          <strong>
            SYSTEM ERROR
          </strong>

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =====================================
          LOADING
      ====================================== */}
      {loading && (
        <div className="members-loading">

          <div className="members-loader"></div>

          <span>
            LOADING MEMBERS...
          </span>

        </div>
      )}


      {/* =====================================
          TABLE
      ====================================== */}
      {!loading &&
        !error &&
        members.length > 0 && (

          <section className="members-table-section">

            <div className="table-top-line">
              <span>
                MEMBER DATABASE
              </span>

              <span>
                {totalMembers} TOTAL
              </span>
            </div>


            <div className="members-table-wrapper">

              <table className="modern-members-table">

                <thead>
                  <tr>

                    <th>
                      MEMBER
                    </th>

                    <th>
                      CONTACT
                    </th>

                    <th>
                      PHONE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      JOINED
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {members.map((member) => {

                    const memberId =
                      member._id ||
                      member.id;

                    const memberName =
                      member.name ||
                      "Unknown Member";

                    const initial =
                      memberName
                        .charAt(0)
                        .toUpperCase();

                    return (
                      <tr key={memberId}>

                        <td>

                          <div className="member-identity">

                            <div className="member-avatar">
                              {initial}
                            </div>

                            <div>
                              <strong>
                                {memberName}
                              </strong>

                              <small>
                                MEMBER
                              </small>
                            </div>

                          </div>

                        </td>


                        <td>
                          <span className="member-email">
                            {member.email || "-"}
                          </span>
                        </td>


                        <td>
                          {member.phone || "-"}
                        </td>


                        <td>

                          <span
                            className={
                              member.status ===
                              "ACTIVE"
                                ? "member-status active"
                                : "member-status inactive"
                            }
                          >
                            <span className="status-dot"></span>

                            {member.status ||
                              "UNKNOWN"}
                          </span>

                        </td>


                        <td>

                          {member.joiningDate
                            ? new Date(
                                member.joiningDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : member.createdAt
                            ? new Date(
                                member.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}

                        </td>


                        <td>

                          <button
                            className="view-member-button"
                            onClick={() =>
                              navigate(
                                `/members/${memberId}`
                              )
                            }
                          >
                            VIEW
                            <span>→</span>
                          </button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </section>
        )}


      {/* =====================================
          EMPTY STATE
      ====================================== */}
      {!loading &&
        !error &&
        members.length === 0 && (

          <section className="members-empty">

            <div className="empty-symbol">
              00
            </div>

            <span>
              NO RESULTS
            </span>

            <h2>
              No members found.
            </h2>

            <p>
              Try changing your search or add
              a new member to Gymify.
            </p>

            <div className="empty-actions">

              {(appliedSearch || status) && (
                <button
                  className="empty-clear-button"
                  onClick={clearFilters}
                >
                  CLEAR FILTERS
                </button>
              )}

              <button
                className="empty-add-button"
                onClick={() =>
                  navigate("/members/add")
                }
              >
                + ADD MEMBER
              </button>

            </div>

          </section>
        )}


      {/* =====================================
          PAGINATION
      ====================================== */}
      {!loading &&
        !error &&
        pagination.totalPages > 0 && (

          <div className="members-pagination">

            <button
              disabled={
                !pagination.hasPreviousPage
              }
              onClick={() =>
                setPage(
                  (current) => current - 1
                )
              }
            >
              ← PREVIOUS
            </button>


            <div className="pagination-center">

              <span>
                PAGE
              </span>

              <strong>
                {pagination.page}
              </strong>

              <span>
                / {pagination.totalPages}
              </span>

            </div>


            <button
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                setPage(
                  (current) => current + 1
                )
              }
            >
              NEXT →
            </button>

          </div>
        )}

    </div>
  );
}

export default Members;