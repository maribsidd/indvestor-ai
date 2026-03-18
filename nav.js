(function(){
  var raw = localStorage.getItem('iv_user');
  if(!raw){ window.location.href='login.html'; return; }
  var u = JSON.parse(raw);

  // Set initials
  document.querySelectorAll('.user-dot').forEach(function(d){
    d.textContent = u.initials;
    d.style.cursor = 'pointer';
  });

  // Build dropdown
  var dropdown = document.getElementById('profileDropdown');
  if(dropdown){
    dropdown.innerHTML =
      '<div style="padding:14px 16px;border-bottom:1px solid var(--border)">' +
        '<div style="font-weight:600;font-size:14px;color:var(--text)">' + u.fname + ' ' + u.lname + '</div>' +
        '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + u.email + '</div>' +
      '</div>' +
      '<div style="padding:8px">' +
        '<div style="padding:8px 12px;font-size:13px;color:var(--muted)">📞 ' + u.phone + '</div>' +
        '<div style="padding:8px 12px;font-size:13px;color:var(--muted)">Experience: <span style="color:var(--text)">' + u.exp + '</span></div>' +
        '<div style="padding:8px 12px;font-size:13px;color:var(--muted)">Style: <span style="color:var(--text)">' + u.style + '</span></div>' +
        '<button onclick="logout()" style="width:100%;margin-top:8px;padding:9px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:8px;color:#ef4444;font-size:13px;cursor:pointer;font-family:Poppins,sans-serif;font-weight:600">Sign Out</button>' +
      '</div>';
  }

  // Click handler — attached after a short delay so DOM is ready
  setTimeout(function(){
    document.querySelectorAll('.user-dot').forEach(function(d){
      d.addEventListener('click', function(e){
        e.stopPropagation();
        if(!dropdown) return;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      });
    });
  }, 100);

  // Close on outside click
  document.addEventListener('click', function(){
    if(dropdown) dropdown.style.display = 'none';
  });
  if(dropdown){
    dropdown.addEventListener('click', function(e){ e.stopPropagation(); });
  }
})();

function logout(){
  localStorage.removeItem('iv_user');
  window.location.href = 'login.html';
}
