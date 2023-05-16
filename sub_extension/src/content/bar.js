function addBarButtons(){
    const barContainer = document.getElementsByClassName('tr-1jnlk6v').slice(-1)[0];
    const spacer = barContainer.getElementsByClassName('ltr-14rufaj')[2];
    const duplicateSpacer = spacer.cloneNode(true);
    const duplicateSpacer2 = spacer.cloneNode(true);
    barContainer.insertBefore(duplicateSpacer, spacer);
    barContainer.insertBefore(duplicateSpacer2, spacer);
    const newIcon = document.createElement('div');
    newIcon.className = 'cinelearn-bar-button';
    newIcon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>';
    barContainer.insertBefore(newIcon, duplicateSpacer2);
}